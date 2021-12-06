// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const { preprocessTypescript } = require('@nrwl/cypress/plugins/preprocessor');

module.exports = (on, config) => {
  /* @hack using deprecated preprocessTypescript
   * as there is something wrong with the default Cypress config
   * that produces the following error when using things like @jscutlery/harness
   * that imports @angular/cdk/testing:
   *     Error: Webpack Compilation Error
   *     /jscutlery/devkit/node_modules/@angular/cdk/fesm2015/testing/testbed.mjs
   *     Module not found: Error: Can't resolve '@angular/cdk/keycodes' 
   *     in '/jscutlery/devkit/node_modules/@angular/cdk/fesm2015/testing' */
  on('file:preprocessor', preprocessTypescript(config));
};
