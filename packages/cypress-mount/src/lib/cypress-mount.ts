import '@angular/compiler';

import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { injectStylesBeforeElement, StyleOptions } from '@cypress/mount-utils';
import { DynamicModule } from 'ng-dynamic-component';

import type { PlatformRef, SchemaMetadata, Type } from '@angular/core';
import type { Story } from '@storybook/angular';

export interface BaseMountOptions extends Partial<StyleOptions> {
  imports?: NgModule['imports'];
  declarations?: NgModule['declarations'];
  providers?: NgModule['providers'];
  schemas?: SchemaMetadata[];
}

export interface MountOptions extends BaseMountOptions {
  inputs?: { [key: string]: unknown };
}
export type MountTemplateOptions = BaseMountOptions;
export type MountStoryOptions = Partial<StyleOptions>;

/**
 * @internal
 */
export const NG_ROOT_ID = '#root';

/**
 * Mount a component from a Storybook story.
 *
 * @param story a story in Storybook format.
 */
export function mountStory(
  story: Story,
  options: MountStoryOptions = {}
): Cypress.Chainable<void> {
  const args = story.args;

  const { component, moduleMetadata } = story({ args }, { args } as any);

  return mount(component, {
    ...moduleMetadata,
    ...options,
    inputs: args,
  });
}

let platformRef: PlatformRef;

/**
 * Mount given component or template.
 */
export function mount(
  component: Type<unknown>,
  options?: MountOptions
): Cypress.Chainable<void>;
export function mount(
  template: string,
  options?: MountTemplateOptions
): Cypress.Chainable<void>;
export function mount(
  componentOrTemplate: Type<unknown> | string,
  options: MountOptions | MountTemplateOptions = {}
): Cypress.Chainable<void> {
  return cy.then(async () => {
    Cypress.log({
      name: 'mount',
      message:
        typeof componentOrTemplate !== 'string'
          ? componentOrTemplate['name']
          : componentOrTemplate,
    });

    /* Destroy existing platform. */
    if (platformRef != null) {
      platformRef.destroy();
    }

    /* Prepare container component metadata which are
     * the same for mounting a component or template. */
    const componentMetadata = {
      selector: '#root',
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

    _injectStyles(options);
  });
}

/**
 * @internal
 */
export function _createContainerComponent({
  componentMetadata,
  klass,
}: {
  componentMetadata: Component;
  klass: { new (): unknown };
}): Type<unknown> {
  /* Decorate component manually to avoid runtime error:
   * NG0303: Can't bind to 'ngComponentOutlet' since it isn't a known property of 'ng-container'.
   * because `ContainerModule` is also bypassing AOT. */
  return Component(componentMetadata)(klass);
}

/**
 * @internal
 */
export async function _bootstrapComponent(options: {
  component: Type<unknown>;
  imports?: NgModule['imports'];
  declarations?: NgModule['declarations'];
  providers?: NgModule['providers'];
  schemas?: SchemaMetadata[];
}) {
  const module = _createRootModule(options);
  platformRef = platformBrowserDynamic();
  await platformRef.bootstrapModule(module);
}

/**
 * Create a root module to bootstrap on.
 * @internal
 */
export function _createRootModule({
  component,
  imports = [],
  declarations = [],
  providers = [],
  schemas = [],
}: {
  component: Type<unknown>;
  imports?: NgModule['imports'];
  declarations?: NgModule['declarations'];
  providers?: NgModule['providers'];
  schemas?: SchemaMetadata[];
}) {
  /* Decorate module manually to avoid AOT errors like:
   * NG1010: Value at position 1 in the NgModule.imports of ContainerModule is not a reference
   * Value could not be determined statically..
   * as we want to be able to add imports dynamically. */
  const ContainerModule = NgModule({
    bootstrap: [component],
    declarations: [component, ...declarations],
    imports: [BrowserModule, DynamicModule, ...imports],
    providers,
    schemas,
  })(class {});

  return ContainerModule;
}

/**
 * @internal
 */
export function _injectStyles(options: Partial<StyleOptions>): void {
  const el = cy.$$(NG_ROOT_ID).get(0);
  injectStylesBeforeElement(options, document, el);
}
