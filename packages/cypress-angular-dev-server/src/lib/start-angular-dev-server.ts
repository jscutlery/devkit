import { ResolvedDevServerConfig } from '@cypress/webpack-dev-server';
/// <reference types="cypress"/>

/**
 * @deprecated 🚧 Work in progress.
 */
export function startAngularDevServer({
  config,
  options,
}: {
  config: Cypress.PluginConfigOptions;
  options: Cypress.DevServerOptions;
}): Promise<ResolvedDevServerConfig> {
  throw new Error('🚧 Work in progress!');
}
