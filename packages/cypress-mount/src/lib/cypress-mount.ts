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

/**
 * Mount a component from a Storybook story.
 *
 * @param story a story in Storybook format.
 */
export function mountStory(story: Story) {
  const args = story.args;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { component, moduleMetadata } = story({ args }, { args } as any);
  mount(component, {
    ...moduleMetadata,
    inputs: args,
  });
}

let platformRef: PlatformRef;

export interface MountConfig {
  imports?: Type<unknown>[];
  providers?: StaticProvider[];
  inputs?: { [key: string]: unknown };
  styles?: string[];
  schemas?: SchemaMetadata[];
}

/**
 * Mount given component.
 */
export function mount(component: Type<unknown>, config: MountConfig = {}) {
  /* Destroy existing platform. */
  if (platformRef != null) {
    platformRef.destroy();
  }

  const ContainerModule = _createContainerModule({
    ...config,
    component,
  });
  platformRef = platformBrowserDynamic();
  platformRef.bootstrapModule(ContainerModule);
}

/**
 * Create a root module to bootstrap on.
 */
export function _createContainerModule({
  component,
  inputs = {},
  imports = [],
  providers = [],
  styles = [],
  schemas = [],
}: {
  component: Type<unknown>;
} & MountConfig) {
  /* Decorate component manually to avoid runtime error:
   *   NG0303: Can't bind to 'ngComponentOutlet' since it isn't a known property of 'ng-container'.
   * because `ContainerModule` is also bypassing AOT. */
  const ContainerComponent = Component({
    /* Make sure that styles are applied globally. */
    encapsulation: ViewEncapsulation.None,
    selector: '#root',
    styles,
    template: `<ng-container
    *ngComponentOutlet="component; ndcDynamicInputs: inputs"
  ></ng-container>`,
  })(
    class {
      component = component;
      inputs = inputs;
    }
  );

  /* Decorate module manually to avoid AOT errors like:
   *   NG1010: Value at position 1 in the NgModule.imports of ContainerModule is not a reference
   *   Value could not be determined statically..
   * as we want to be able to add imports dynamically. */
  const ContainerModule = NgModule({
    bootstrap: [ContainerComponent],
    declarations: [ContainerComponent],
    imports: [BrowserModule, DynamicModule, ...imports],
    providers,
    schemas,
  })(class {});

  return ContainerModule;
}
