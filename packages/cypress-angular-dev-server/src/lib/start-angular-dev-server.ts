/// <reference types="cypress"/>
import { startDevServer } from '@cypress/webpack-dev-server';
import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import type { ResolvedDevServerConfig } from '@cypress/webpack-dev-server';

import { createAngularWebpackConfig } from './create-angular-webpack-config';

export async function startAngularDevServer({
  webpackConfig,
  options,
  tsConfig = 'tsconfig.json',
}: {
  webpackConfig?: Configuration;
  /**
   * @deprecated config is already passed inside options.
   * @sunset 2.0.0
   */
  config?: Cypress.RuntimeConfigOptions;
  options: Cypress.DevServerOptions;
  tsConfig?: string;
}): Promise<ResolvedDevServerConfig> {
  const angularWebpackConfig = await createAngularWebpackConfig({
    projectRoot: options.config.projectRoot,
    sourceRoot: options.config.componentFolder as string,
    tsConfig,
  });

  return startDevServer({
    options,
    webpackConfig: webpackConfig != null
      ? merge(angularWebpackConfig, webpackConfig)
      : angularWebpackConfig,
  });
}
