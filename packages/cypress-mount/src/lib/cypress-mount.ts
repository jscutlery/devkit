import { Component, Type } from '@angular/core';
import { TestModuleMetadata } from '@angular/core/testing';
import { initEnv, mount as cypressMount, setConfig } from 'cypress-angular-unit-test/dist';

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

export function mountWithConfig(
  component: Type<unknown>,
  config?: Config & { inputs?: { [key: string]: unknown } }
) {
  const { inputs, ...rest } = config;
  if (Object.keys(rest).length > 0) {
    setup(config);
  }
  mount(component, { inputs });
}
