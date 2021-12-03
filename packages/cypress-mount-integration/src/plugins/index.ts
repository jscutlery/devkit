import { startAngularDevServer } from '@jscutlery/cypress-angular-dev-server';

module.exports = (on, config) => {
  on('dev-server:start', (options) =>
    startAngularDevServer({
      config,
      options,
      webpackConfig: {
        resolve: {
          fallback: {
            path: require.resolve('path-browserify'),
          },
        },
      },
    })
  );
  return config;
};
