const {
  startAngularDevServer,
} = require('@jscutlery/cypress-angular-dev-server');

module.exports = (on, config) => {
  on('dev-server:start', (options) =>
    startAngularDevServer({ config, options })
  );
  return config;
};
