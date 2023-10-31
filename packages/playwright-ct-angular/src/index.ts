/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export { devices, expect, test } from './lib/playwright-ct-angular';
export type { ComponentFixtures } from './lib/playwright-ct-angular';

import { defineConfig as originalDefineConfig } from '@playwright/experimental-ct-core';
import * as path from 'path';

function plugin() {
  /* Only fetch upon request to avoid resolution in workers. */
  const {
    createPlugin,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('@playwright/experimental-ct-core/lib/vitePlugin');
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return createPlugin(path.join(__dirname, 'register-source.mjs'), () => {});
}

export const defineConfig: typeof originalDefineConfig = (config) =>
  originalDefineConfig({ ...config, _plugins: [plugin] });
