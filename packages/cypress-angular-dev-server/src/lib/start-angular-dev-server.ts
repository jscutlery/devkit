/// <reference types="cypress"/>
import { startDevServer } from '@cypress/webpack-dev-server';
import { merge } from 'webpack-merge';
import type { Configuration } from 'webpack';
import type { ResolvedDevServerConfig } from '@cypress/webpack-dev-server';

import { createAngularWebpackConfig } from './create-angular-webpack-config';

export interface CypressAngularDevServerOptions {
  options: Cypress.DevServerConfig;

  /**
   * Custom Webpack configuration merged with Angular CLI configuration.
   */
  webpackConfig?: Configuration;

  /**
   * @deprecated config is already passed inside options.
   * @sunset 2.0.0
   */
  config?: Cypress.RuntimeConfigOptions;

  /**
   * Cypress ts config, default to 'tsconfig.json'.
   */
  tsConfig?: string;

  /**
   * Load build options (like assets, scripts, polyfills, etc...) from the specified target.
   */
  target?: string;
}

export async function startAngularDevServer({
  webpackConfig,
  options,
  tsConfig = 'tsconfig.json',
  target
}: CypressAngularDevServerOptions): Promise<ResolvedDevServerConfig> {


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
