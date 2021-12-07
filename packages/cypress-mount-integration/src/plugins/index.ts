import { startAngularDevServer } from '@jscutlery/cypress-angular-dev-server';

module.exports = ((on, config) => {
  on('dev-server:start', (options) =>
    startAngularDevServer({
      config,
      options,
      /* @hack this fixes the following error:
       * "Module not found: Error: Can't resolve 'path' in '.../node_modules/@storybook/store/dist/esm'"
       * as storybook requires 'path' even though it's not used and webpack 5 removed the polyfill. */
      webpackConfig: {
        resolve: {
          fallback: {
            path: require.resolve('path-browserify'),
          },
        },
      },
    })
  );
}) as Cypress.PluginConfig;
