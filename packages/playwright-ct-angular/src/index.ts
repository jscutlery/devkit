import * as path from 'node:path';
import type {
  PlaywrightTestConfig,
  TestType,
} from '@playwright/experimental-ct-core';
import * as playwrightCtCore from '@playwright/experimental-ct-core';
import type { ComponentFixtures } from './lib/playwright-ct-angular';

export { devices, expect } from '@playwright/experimental-ct-core';
export type { ComponentFixtures };

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
