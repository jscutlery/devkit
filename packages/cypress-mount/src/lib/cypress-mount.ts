import {
  Component,
  NgModule,
  PlatformRef,
  SchemaMetadata,
  StaticProvider,
  Type,
  ViewEncapsulation,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Story } from '@storybook/angular';
import { DynamicModule } from 'ng-dynamic-component';

export type Style = string;

export interface MountStoryOptions {
  styles?: Style[];
}

/**
 * Mount a component from a Storybook story.
 *
 * @param story a story in Storybook format.
 */
export async function mountStory(
  story: Story,
  options: MountStoryOptions = {}
) {
  const args = story.args;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { component, moduleMetadata } = story({ args }, { args } as any);
  await mount(component, {
    ...moduleMetadata,
    ...options,
    inputs: args,
  });
}

let platformRef: PlatformRef;

export interface BaseMountOptions {
  imports?: Type<unknown>[];
  providers?: StaticProvider[];
  styles?: Style[];
  schemas?: SchemaMetadata[];
}

export interface MountOptions extends BaseMountOptions {
  inputs?: { [key: string]: unknown };
}

export type MountTemplateOptions = BaseMountOptions;

/**
 * Mount given component or template.
 */
export async function mount(
  component: Type<unknown>,
  options?: MountOptions
): Promise<void>;
export async function mount(
  template: string,
  options?: MountTemplateOptions
): Promise<void>;
export async function mount(
  componentOrTemplate: Type<unknown> | string,
  options: MountOptions | MountTemplateOptions = {}
): Promise<void> {
  /* Destroy existing platform. */
  if (platformRef != null) {
    platformRef.destroy();
  }

  /* Prepare container component metadata which are
   * the same for mounting a component or template. */
  const componentMetadata = {
    /* Make sure that styles are applied globally. */
    encapsulation: ViewEncapsulation.None,
    selector: '#root',
    styles: options.styles,
  };

  const containerComponent =
    typeof componentOrTemplate !== 'string'
      ? /* Component. */
        _createContainerComponent({
          componentMetadata: {
            ...componentMetadata,
            template: `<ng-container
            *ngComponentOutlet="component; ndcDynamicInputs: inputs"
          ></ng-container>`,
          },
          klass: class {
            component = componentOrTemplate;
            inputs = (options as MountOptions).inputs;
          },
        })
      : /* Template. */
        _createContainerComponent({
          componentMetadata: {
            ...componentMetadata,
            template: componentOrTemplate,
          },
          klass: class {},
        });

  await _bootstrapComponent({
    component: containerComponent,
    ...options,
  });
}

export function _createContainerComponent({
  componentMetadata,
  klass,
}: {
  componentMetadata;
  klass;
}): Type<unknown> {
  /* Decorate component manually to avoid runtime error:
   *   NG0303: Can't bind to 'ngComponentOutlet' since it isn't a known property of 'ng-container'.
   * because `ContainerModule` is also bypassing AOT. */
  return Component(componentMetadata)(klass);
}

export async function _bootstrapComponent(options: {
  component: Type<unknown>;
  imports?: Type<unknown>[];
  providers?: StaticProvider[];
  schemas?: SchemaMetadata[];
}) {
  const module = _createRootModule(options);
  platformRef = platformBrowserDynamic();
  await platformRef.bootstrapModule(module);
}

/**
 * Create a root module to bootstrap on.
 */
export function _createRootModule({
  component,
  imports = [],
  providers = [],
  schemas = [],
}: {
  component: Type<unknown>;
  imports?: Type<unknown>[];
  providers?: StaticProvider[];
  schemas?: SchemaMetadata[];
}) {
  /* Decorate module manually to avoid AOT errors like:
   *   NG1010: Value at position 1 in the NgModule.imports of ContainerModule is not a reference
   *   Value could not be determined statically..
   * as we want to be able to add imports dynamically. */
  const ContainerModule = NgModule({
    bootstrap: [component],
    declarations: [component],
    imports: [BrowserModule, DynamicModule, ...imports],
    providers,
    schemas,
  })(class {});

  return ContainerModule;
}
