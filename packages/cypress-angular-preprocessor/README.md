# Cypress Angular Preprocessor

This is a Cypress preprocessor adapter of Angular's webpack plugin.
It is used to build components in Cypress in order to be used in combination with [`@jscutlery/cypress-mount`](https://github.com/jscutlery/test-utils/tree/main/packages/cypress-mount) in order to build angular components.

It can be enabled by adding the configuration below to the `*-e2e/src/plugins/index.js` file:

```ts
const {
  angularPreprocessor,
} = require('@jscutlery/cypress-angular-preprocessor');

module.exports = (on, config) => {
  on('file:preprocessor', angularPreprocessor(config));
};
```
