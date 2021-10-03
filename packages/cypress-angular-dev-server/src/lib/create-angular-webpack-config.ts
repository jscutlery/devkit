import { normalizeBrowserSchema } from '@angular-devkit/build-angular/src/utils';
import { generateWebpackConfig } from '@angular-devkit/build-angular/src/utils/webpack-browser-config';
import {
  getBrowserConfig,
  getCommonConfig,
  getStatsConfig,
  getStylesConfig,
  getTypeScriptConfig,
} from '@angular-devkit/build-angular/src/webpack/configs';
import { getSystemPath, normalize, resolve } from '@angular-devkit/core';
import { StartDevServer } from '@cypress/webpack-dev-server';

import type {
  AssetPattern,
  ExtraEntryPoint,
  IndexUnion,
} from '@angular-devkit/build-angular/src/browser/schema';
import type { WebpackConfigOptions } from '@angular-devkit/build-angular/src/utils/build-options';

function getCompilerConfig(wco: WebpackConfigOptions) {
  if (wco.buildOptions.main || wco.buildOptions.polyfills) {
    return getTypeScriptConfig(wco);
  }

  return {};
}

export async function createAngularWebpackConfig(config: {
  projectRoot: string;
  sourceRoot: string;
  tsConfig: string;
  buildOptions?: Record<string, unknown>;
}): Promise<StartDevServer['webpackConfig']> {
  const projectRoot = normalize(config.projectRoot);
  const workspaceRoot = projectRoot;
  const sourceRoot = normalize(config.sourceRoot);
  const tsConfig = normalize(config.tsConfig);

  const buildOptions = config.buildOptions ?? {};
  const polyfills = (buildOptions.polyfills as string) ?? 'placeholder';
  const styles = (buildOptions.styles as ExtraEntryPoint[]) ?? [];
  const scripts = (buildOptions.scripts as ExtraEntryPoint[]) ?? [];
  const assets = (buildOptions.assets as AssetPattern[]) ?? [];
  const main = (buildOptions.main as string) ?? null;
  const index = (buildOptions.index as IndexUnion) ?? null;

  const normalizedOptions = normalizeBrowserSchema(
    workspaceRoot,
    projectRoot,
    sourceRoot,
    {
      tsConfig: getSystemPath(resolve(projectRoot, tsConfig)),
      outputPath: '',
      index,
      main,
      aot: false,
      sourceMap: true,
      scripts,
      styles,
      polyfills,
      assets,
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
