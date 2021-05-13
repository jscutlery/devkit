# Cypress Angular Preprocessor

**Deprecated**: Cypress >= 7 requires the new adapter [@jscutlery/cypress-angular-dev-server](https://github.com/jscutlery/test-utils/tree/main/packages/cypress-angular-dev-server) to build Angular components.

This is a Cypress preprocessor adapter of Angular's webpack plugin.
It is used to build components in Cypress to be used in combination with [`@jscutlery/cypress-mount`](https://github.com/jscutlery/test-utils/tree/main/packages/cypress-mount) in order to build Angular components.

It can be enabled by adding the configuration below to the `*-e2e/src/plugins/index.js` file:

```ts
const {
  angularPreprocessor,
} = require('@jscutlery/cypress-angular-preprocessor');

module.exports = (on, config) => {
  on('file:preprocessor', angularPreprocessor(config));
};
```
