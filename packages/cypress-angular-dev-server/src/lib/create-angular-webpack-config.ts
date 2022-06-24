import type {
  AssetPattern,
  IndexUnion,
  ScriptElement,
  StyleElement,
  StylePreprocessorOptions,
} from '@angular-devkit/build-angular/src/builders/browser/schema';
import { normalizeBrowserSchema } from '@angular-devkit/build-angular/src/utils';
import { generateWebpackConfig } from '@angular-devkit/build-angular/src/utils/webpack-browser-config';
import {
  getCommonConfig,
  getStylesConfig,
} from '@angular-devkit/build-angular/src/webpack/configs';
import { getSystemPath, normalize, resolve } from '@angular-devkit/core';
import type { Configuration } from 'webpack';

export async function createAngularWebpackConfig(config: {
  workspaceRoot: string;
  projectRoot: string;
  sourceRoot: string;
  tsConfig: string;
  buildOptions?: Record<string, unknown>;
}): Promise<Configuration> {
  const projectRoot = normalize(config.projectRoot);
  const sourceRoot = normalize(config.sourceRoot);
  const workspaceRoot = normalize(config.workspaceRoot);
  const tsConfig = normalize(config.tsConfig);

  const buildOptions = config.buildOptions ?? {};
  const polyfills = (buildOptions.polyfills as string) ?? 'placeholder';
  const styles = (buildOptions.styles as StyleElement[]) ?? [];
  const scripts = (buildOptions.scripts as ScriptElement[]) ?? [];
  const assets = (buildOptions.assets as AssetPattern[]) ?? [];
  const stylePreprocessorOptions =
    buildOptions?.stylePreprocessorOptions as StylePreprocessorOptions;
  const main = (buildOptions.main as string) ?? null;
  const index = (buildOptions.index as IndexUnion) ?? null;

  const normalizedOptions = normalizeBrowserSchema(
    workspaceRoot,
    projectRoot,
    workspaceRoot,
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
      stylePreprocessorOptions,
    },
    {}
  );

  const webpackConfig = await generateWebpackConfig(
    getSystemPath(workspaceRoot),
    getSystemPath(projectRoot),
    getSystemPath(sourceRoot),
    '@todo',
    normalizedOptions,
    (wco) => [
      getCommonConfig(wco),
      getStylesConfig({
        ...wco,
        root: config.workspaceRoot,
      }),
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
