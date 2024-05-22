import { expect, test } from 'vitest';
import { swcAngularPreset } from './index';

/**
 * This fixes the following error when users have `.swcrc` files in their workspace:
 * `env` and `jsc.target` cannot be used together
 */
test(`${swcAngularPreset.name} should force @swc/core to ignore any .swcrc file`, () => {
  expect(swcAngularPreset().swcrc).toBe(false);
});
