/// <reference types="cypress"/>
import { startDevServer } from '@cypress/webpack-dev-server';
import { ResolvedDevServerConfig } from '@cypress/webpack-dev-server';
import { createAngularWebpackConfig } from './create-angular-webpack-config';

export async function startAngularDevServer({
  options,
}: {
  /**
   * @deprecated config is already passed inside options.
   * @sunset 2.0.0
   */
  config?: Cypress.RuntimeConfigOptions;
  options: Cypress.DevServerOptions;
}): Promise<ResolvedDevServerConfig> {
  return startDevServer({
    options,
    webpackConfig: await createAngularWebpackConfig({
      projectRoot: options.config.projectRoot,
      sourceRoot: options.config.componentFolder,
    }),
  });
}
