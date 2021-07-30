/// <reference types="cypress"/>
import { startDevServer } from '@cypress/webpack-dev-server';
import type { ResolvedDevServerConfig } from '@cypress/webpack-dev-server';
import { createAngularWebpackConfig } from './create-angular-webpack-config';

export async function startAngularDevServer({
  options,
  tsConfig = 'tsconfig.json',
}: {
  /**
   * @deprecated config is already passed inside options.
   * @sunset 2.0.0
   */
  config?: Cypress.RuntimeConfigOptions;
  options: Cypress.DevServerOptions;
  tsConfig?: string;
}): Promise<ResolvedDevServerConfig> {
  const webpackConfig = await createAngularWebpackConfig({
    projectRoot: options.config.projectRoot,
    sourceRoot: options.config.componentFolder as string,
    tsConfig,
  });

  return startDevServer({
    options,
    webpackConfig,
  });
}
