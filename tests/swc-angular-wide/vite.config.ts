/* eslint-disable @nx/enforce-module-boundaries */
import swc from 'unplugin-swc';
import { defineConfig } from 'vite';

/* @hack for some annoying reason, this file doesn't seem to be compiled
 * using our tsconfigs, so it is not aware of the tsconfig.base.json paths. */
import { swcAngularUnpluginOptions } from '../../packages/swc-angular/src/index';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/tests/swc-angular-wide',
  plugins: [swc.vite(swcAngularUnpluginOptions())],
});
