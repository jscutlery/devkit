import webpackPreprocessor from '@cypress/webpack-batteries-included-preprocessor';


export function getPreprocessorConfig(): Pick<Cypress.Config, 'setupNodeEvents'> {
  return {
    setupNodeEvents(on) {
      /**
       * We need this setup in e2e tests to fix "package exports conditionals"
       * support.
       * In fact, without this, importing @angular/cdk/testing (used by harnesses)
       * will simply fail with a "Module not found" error.
       */
      on('file:preprocessor', webpackPreprocessor({
        typescript: require.resolve('typescript')
      }));
    }
  };
}
