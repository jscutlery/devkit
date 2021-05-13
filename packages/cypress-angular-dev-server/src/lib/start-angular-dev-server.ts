/// <reference types="cypress"/>
import { startDevServer } from '@cypress/webpack-dev-server';
import { ResolvedDevServerConfig } from '@cypress/webpack-dev-server';
import { AngularCompilerPlugin } from '@ngtools/webpack';
import {
  getBrowserConfig,
  getCommonConfig,
  getStatsConfig,
  getStylesConfig,
} from '@angular-devkit/build-angular/src/webpack/configs';
import { getCompilerConfig } from '@angular-devkit/build-angular/src/browser';
import { Type } from '@angular-devkit/build-angular/src/browser/schema';
import { generateWebpackConfig } from '@angular-devkit/build-angular/src/utils/webpack-browser-config';

import {
  getSystemPath,
  logging,
  normalize,
  resolve,
} from '@angular-devkit/core';
import {
  normalizeBrowserSchema,
  NormalizedBrowserBuilderSchema,
} from '@angular-devkit/build-angular/src/utils';
import { ClassField } from '@angular/compiler';
export async function startAngularDevServer({
  config,
  options,
}: {
  config: Cypress.PluginConfigOptions;
  options: Cypress.DevServerOptions;
}): Promise<ResolvedDevServerConfig> {
  // cf. https://github.com/angular/angular-cli/blob/c1512e42742c17ace82e783e8e9c919ae925d269/packages/angular_devkit/build_angular/src/dev-server/index.ts#L168-L182
  const workspaceRoot = normalize(`${config.projectRoot}/../..`);
  const projectRoot = resolve(workspaceRoot, normalize('packages/sandbox'));
  const sourceRoot = resolve(workspaceRoot, normalize('packages/sandbox/src'));

  const normalizedOptions = normalizeBrowserSchema(
    workspaceRoot,
    projectRoot,
    sourceRoot,
    {
      tsConfig: 'packages/sandbox/tsconfig.json',
      outputPath: 'dist/packages/sandbox',
      index: 'packages/sandbox/src/index.html',
      main: 'packages/sandbox/src/main.ts',
      polyfills: 'packages/sandbox/src/polyfills.ts',
      aot: true,
      styles: ['packages/sandbox/src/styles.css'],
      scripts: [],
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
    sourceRoot && getSystemPath(sourceRoot),
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
