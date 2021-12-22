import { startAngularDevServer } from '@jscutlery/cypress-angular';

module.exports = (on, config) => {
  on('dev-server:start', (options) =>
    startAngularDevServer({
      config,
      options,
      tsConfig: 'tsconfig.cypress.json',
      target: 'microwave:build',
    })
  );
  return config;
};
