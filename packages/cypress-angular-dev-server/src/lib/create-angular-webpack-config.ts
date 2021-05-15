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

export async function createAngularWebpackConfig(
  config: Cypress.RuntimeConfigOptions
): Promise<StartDevServer['webpackConfig']> {
  const projectRoot = normalize(config.projectRoot);
  /* @todo replace with dynamic root */
  const workspaceRoot = resolve(projectRoot, normalize('../../'));
  const sourceRoot = normalize(config.componentFolder);

  const normalizedOptions = normalizeBrowserSchema(
    workspaceRoot,
    projectRoot,
    sourceRoot,
    {
      tsConfig: resolve(projectRoot, normalize('tsconfig.json')),
      outputPath: '',
      index: null,
      main: null,
      aot: false,
      polyfills: 'placeholder', // WTF!?? it crashes without?
      /* @todo dynamically import assets, styles & scripts from target's angular.json|workspace.json config. */
    }
  );

  const logger = {
    ...console,
    createChild() {
      return this;
    },
    fatal: console.error,
  };

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
    logger,
    {}
  );

  return webpackConfig;
}
