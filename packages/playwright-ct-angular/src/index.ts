import * as path from 'node:path';
import { Type } from '@angular/core';
import type {
  PlaywrightTestConfig,
  TestType,
} from '@playwright/experimental-ct-core';
import * as playwrightCtCore from '@playwright/experimental-ct-core';
import * as playwright from '@playwright/test';
import type { Observable } from 'rxjs';

export type { PlaywrightTestConfig };
export { expect, devices } from '@playwright/test';

export interface ComponentFixtures {
  mount<COMPONENT>(
    component: Type<COMPONENT>,
    options?: MountOptions<COMPONENT>,
  ): Promise<MountResult<COMPONENT>>;
}

export interface MountOptions<COMPONENT> {
  props?: Partial<COMPONENT>;
  on?: Outputs<COMPONENT>;
}

export type Outputs<COMPONENT> = Partial<{
  /* For each field or method... is this an observable? */
  [K in keyof COMPONENT]: COMPONENT[K] extends Observable<unknown>
    ? /* It's an observable, so let's change the return type. */
      (value: Emitted<COMPONENT[K]>) => void
    : /* It's something else. */
      COMPONENT[K];
}>;

export interface MountResult<COMPONENT> extends playwright.Locator {
  unmount(): Promise<void>;

  update(options: {
    props?: Partial<COMPONENT>;
    on?: Outputs<COMPONENT>;
  }): Promise<void>;
}

type Emitted<OBSERVABLE> =
  OBSERVABLE extends Observable<infer EMITTED> ? EMITTED : OBSERVABLE;

/* @hack `test` is not exported in the type definition of `@playwright/experimental-ct-core`. */
export const test: TestType<ComponentFixtures> = (playwrightCtCore as any).test;

export const defineConfig = (config, ...configs): PlaywrightTestConfig => {
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
