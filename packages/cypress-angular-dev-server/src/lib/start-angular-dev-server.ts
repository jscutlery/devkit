/// <reference types="cypress"/>
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
import {
  ResolvedDevServerConfig,
  startDevServer,
} from '@cypress/webpack-dev-server';

export async function startAngularDevServer({
  config,
  options,
}: {
  config: Cypress.PluginConfigOptions;
  options: Cypress.DevServerOptions;
}): Promise<ResolvedDevServerConfig> {
  console.log(config);

  // cf. https://github.com/angular/angular-cli/blob/c1512e42742c17ace82e783e8e9c919ae925d269/packages/angular_devkit/build_angular/src/dev-server/index.ts#L168-L182
  const testProjectRoot = normalize(config.projectRoot);
  const workspaceRoot = resolve(testProjectRoot, normalize('../..'));
  const projectRoot = testProjectRoot;
  const sourceRoot = normalize(config['componentFolder']);

  const normalizedOptions = normalizeBrowserSchema(
    workspaceRoot,
    projectRoot,
    sourceRoot,
    {
      tsConfig: resolve(testProjectRoot, normalize('tsconfig.json')),
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

  return startDevServer({
    options,
    webpackConfig,
  });
}
