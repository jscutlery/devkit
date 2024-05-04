import * as path from 'node:path';
import {
  EnvironmentProviders,
  InputSignal,
  Provider,
  Type,
} from '@angular/core';
import type {
  PlaywrightTestConfig,
  TestType,
} from '@playwright/experimental-ct-core';
import * as playwrightCtCore from '@playwright/experimental-ct-core';
import { JsonObject } from '@playwright/experimental-ct-core/types/component';
import * as playwright from '@playwright/test';

export type { PlaywrightTestConfig };
export { expect, devices } from '@playwright/test';

export interface ComponentFixtures {
  mount<COMPONENT, HOOKS extends JsonObject>(
    template: string,
    options?: MountTemplateOptions<COMPONENT, HOOKS>,
  ): Promise<MountResult<COMPONENT>>;

  mount<COMPONENT, HOOKS extends JsonObject>(
    component: Type<COMPONENT>,
    options?: MountOptions<COMPONENT, HOOKS>,
  ): Promise<MountResult<COMPONENT>>;
}

export interface MountOptions<COMPONENT, HOOKS> {
  hooksConfig?: HOOKS;
  providers?: Array<Provider | EnvironmentProviders>;
  props?: Inputs<COMPONENT>;
  on?: OutputListeners<COMPONENT>;
}

export interface MountTemplateOptions<COMPONENT, HOOKS extends JsonObject>
  extends MountOptions<COMPONENT, HOOKS> {
  imports?: Type<unknown>[];
}

export interface MountResult<COMPONENT> extends playwright.Locator {
  unmount(): Promise<void>;

  update(options: {
    props?: Inputs<COMPONENT>;
    on?: OutputListeners<COMPONENT>;
  }): Promise<void>;
}

export type Inputs<COMPONENT> = Partial<{
  [PROPERTY in keyof COMPONENT]: COMPONENT[PROPERTY] extends InputSignal<
    infer VALUE
  >
    ? VALUE
    : COMPONENT[PROPERTY];
}>;

export type OutputListeners<COMPONENT> = {
  [PROPERTY in keyof COMPONENT as COMPONENT[PROPERTY] extends Subscribable<any>
    ? PROPERTY
    : never]: (value: Emitted<COMPONENT[PROPERTY]>) => void;
};

interface Subscribable<T> {
  subscribe(subscriber: (value: T) => void): void;
}

type Emitted<SUBSCRIBABLE> =
  SUBSCRIBABLE extends Subscribable<infer EMITTED> ? EMITTED : SUBSCRIBABLE;

/* @hack `test` is not exported in the type definition of `@playwright/experimental-ct-core`. */
// @eslint-disable-next-line @typescript-eslint/no-explicit-any
export const test: TestType<ComponentFixtures> = (playwrightCtCore as any).test;

export const defineConfig: typeof playwrightCtCore.defineConfig = (
  config,
  ...configs
): PlaywrightTestConfig => {
  const original = playwrightCtCore.defineConfig(
    {
      ...config,
      '@playwright/test': {
        packageJSON: require.resolve('./package.json'),
      },
      '@playwright/experimental-ct-core': {
        registerSourceFile: path.join(__dirname, 'register-source.mjs'),
      },
    },
    ...configs,
  );

  /* @hack for some weird reason, if we do not require the babel plugin here,
   * babel loads an empty object instead of the default exported function. */
  require('@jscutlery/playwright-ct-angular/transform-angular');

  return {
    ...original,
    '@playwright/test': {
      ...original['@playwright/test'],
      babelPlugins: [
        ...original['@playwright/test'].babelPlugins,
        [require.resolve('@jscutlery/playwright-ct-angular/transform-angular')],
      ],
    },
  } as PlaywrightTestConfig;
};
