/* eslint-disable @nx/enforce-module-boundaries */
import { defineConfig } from 'vite';
import swc from 'unplugin-swc';

/* @hack for some annoying reason, this file doesn't seem to be compiled
 * using our tsconfigs, so it is not aware of the tsconfig.base.json paths. */
import swcAngularPreset from '../../packages/swc-angular-preset/src/index';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/tests/swc-plugin-angular-wide',
  plugins: [swc.vite(swcAngularPreset)]
});
