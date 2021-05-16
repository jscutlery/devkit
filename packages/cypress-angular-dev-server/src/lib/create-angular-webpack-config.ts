import { getCompilerConfig } from '@angular-devkit/build-angular/src/browser';
import { normalizeBrowserSchema } from '@angular-devkit/build-angular/src/utils';
import { generateWebpackConfig } from '@angular-devkit/build-angular/src/utils/webpack-browser-config';
import {
  getBrowserConfig,
  getCommonConfig,
  getStatsConfig,
  getStylesConfig,
} from '@angular-devkit/build-angular/src/webpack/configs';
import { getSystemPath, normalize, resolve } from '@angular-devkit/core';
import { StartDevServer } from '@cypress/webpack-dev-server';

export async function createAngularWebpackConfig(config: {
  projectRoot: string;
  sourceRoot: string;
  tsConfig: string;
}): Promise<StartDevServer['webpackConfig']> {
  const projectRoot = normalize(config.projectRoot);
  /* @todo discover workspace root by crawling up to `angular.json|workspace.json`. */
  const workspaceRoot = projectRoot;
  const sourceRoot = normalize(config.sourceRoot);
  const tsConfig = normalize(config.tsConfig);

  const normalizedOptions = normalizeBrowserSchema(
    workspaceRoot,
    projectRoot,
    sourceRoot,
    {
      tsConfig: resolve(projectRoot, tsConfig),
      /* @hack outputPath is required, otherwise `getCommonConfig` crashes. */
      outputPath: '',
      index: null,
      main: null,
      aot: false,
      /* @hack polyfills are required, otherwise for some weird reason the produced
       * webpack config doesn't build anything properly. */
      polyfills: 'POLYFILL_PLACEHOLDER',
      /* @todo dynamically import assets, styles & scripts from target's angular.json|workspace.json config. */
    }
  );

  const webpackConfig = await generateWebpackConfig(
    getSystemPath(workspaceRoot),
    getSystemPath(projectRoot),
    getSystemPath(sourceRoot),
    normalizedOptions,
    (wco) => [
      getCommonConfig(wco),
      getBrowserConfig(wco),
      getStylesConfig(wco),
      getStatsConfig(wco),
      getCompilerConfig(wco),
    ],
    _createFakeLogger(),
    {}
  );

  return webpackConfig;
}

export function _createFakeLogger() {
  return {
    ...console,
    createChild() {
      return this;
    },
    fatal: console.error,
  };
}
