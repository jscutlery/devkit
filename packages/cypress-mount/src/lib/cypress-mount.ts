import { Story } from '@storybook/angular';
import { Component, SchemaMetadata, StaticProvider, Type } from '@angular/core';
import { TestModuleMetadata } from '@angular/core/testing';
import {
  initEnv,
  mount as cypressMount,
  setConfig,
} from 'cypress-angular-unit-test/dist';

/**
 * This is a stupid hack meanwhile we fix this issue
 * https://github.com/bahmutov/cypress-angular-unit-test/issues/248
 */
@Component({
  selector: 'noop',
  template: `noop`,
})
export class NoopComponent {}

export interface Config extends TestModuleMetadata {
  detectChanges?: boolean;
  styles?: string[];
}

export function setup(config: Config) {
  const { detectChanges = true, styles, ...moduleDef } = config;

  setConfig({
    detectChanges,
    styles,
  });
  initEnv(NoopComponent, moduleDef);
}

export function mount(
  component: Type<unknown>,
  config: { inputs?: { [key: string]: unknown } } = {}
) {
  cypressMount(component, config.inputs);
}

export function setupAndMount(
  component: Type<unknown>,
  config: Config & { inputs?: { [key: string]: unknown } } = {}
) {
  const { inputs, ...rest } = config;
  if (Object.keys(rest).length > 0) {
    setup(config);
  }
  mount(component, { inputs });
}

/**
 * Mount a component from a Storybook story.
 *
 * @param story a story in Storybook format.
 */
export function mountStory(story: Story) {
  const args = story.args;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { component, moduleMetadata } = story({ args }, { args } as any);
  setupAndMount(component, {
    ...moduleMetadata,
    inputs: args,
  });
}

/**
 * This will replace both `mount` and `setupAndMount`
 * so we won't need `cypress-angular-unit-test` anymore.
 * @deprecated 🚧 Work in progress.
 */
export function mountV2(
  component: Type<unknown>,
  config: {
    declarations?: Type<unknown>[];
    imports?: Type<unknown>[];
    inputs?: { [key: string]: unknown };
    providers?: StaticProvider[];
    schemas?: SchemaMetadata[];
  } = {}
) {
  throw new Error('🚧 Work in progress!');
}

/**
 * @deprecated use {@link setupAndMount} instead.
 * This will be removed in 1.0.0
 *
 * @sunset 1.0.0
 */
export function mountWithConfig(
  ...args: Parameters<typeof setupAndMount>
): ReturnType<typeof setupAndMount> {
  return setupAndMount(...args);
}
