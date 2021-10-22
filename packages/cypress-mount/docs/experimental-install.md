# Experimental Setup for Cypress < 7

**Deprecated**: Cypress >= 7 requires the new adapter [@jscutlery/cypress-angular-dev-server](https://github.com/jscutlery/devkit/tree/main/packages/cypress-angular-dev-server) to build Angular components.

### 1. Install

```shell
yarn add -D @jscutlery/cypress-mount @jscutlery/cypress-angular-preprocessor

# or

npm install -D @jscutlery/cypress-mount @jscutlery/cypress-angular-preprocessor
```

### 2. Enable Cypress Component Testing

2.a. Enable Cypress Component Testing by updating `cypress.json`:

```json
{
  ...
  "componentFolder": "./src/components",
  "experimentalComponentTesting": true
}
```

2.b. Import support commands by updating e2e folder's `*-e2e/src/support/index.ts` and adding:

```ts
import '@jscutlery/cypress-mount/support';
```

2.c. Setup Angular preprocessor in `*-e2e/src/plugins/index.js`, in order to build angular components (e.g. handle templateUrl etc...):

```ts
const { angularPreprocessor } = require('@jscutlery/cypress-angular-preprocessor');

module.exports = (on, config) => {
  on('file:preprocessor', angularPreprocessor(config));
};
```
