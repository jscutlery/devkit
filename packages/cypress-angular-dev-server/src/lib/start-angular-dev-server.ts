/// <reference types="cypress"/>
import { startDevServer } from '@cypress/webpack-dev-server';
import { ResolvedDevServerConfig } from '@cypress/webpack-dev-server';
import { createAngularWebpackConfig } from './create-angular-webpack-config';

export async function startAngularDevServer({
  config,
  options,
}: {
  config: Cypress.RuntimeConfigOptions;
  options: Cypress.DevServerOptions;
}): Promise<ResolvedDevServerConfig> {
  return startDevServer({
    options,
    webpackConfig: await createAngularWebpackConfig({
      projectRoot: config.projectRoot,
      sourceRoot: config.componentFolder,
    }),
  });
}
