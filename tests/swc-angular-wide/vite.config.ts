/* eslint-disable @nx/enforce-module-boundaries */
import swc from 'unplugin-swc';
import { defineConfig } from 'vite';
import { swcAngularUnpluginOptions } from '@jscutlery/swc-angular';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/tests/swc-angular-wide',
  plugins: [swc.vite(swcAngularUnpluginOptions())],
});
