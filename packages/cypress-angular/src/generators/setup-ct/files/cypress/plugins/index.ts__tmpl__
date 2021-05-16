import { startAngularDevServer } from '@jscutlery/cypress-angular';

module.exports = (on, config) => {
  on('dev-server:start', (options) =>
    startAngularDevServer({ options, tsConfig: 'tsconfig.cypress.json' })
  );
  return config;
};
