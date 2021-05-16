# Cypress Angular Dev Server

This is an internal package used by [`@jscutlery/cypress-angular`](https://github.com/jscutlery/test-utils/tree/main/packages/cypress-angular).

It is a helper for starting a Cypress 7+ dev server for Angular. It is used to build components in Cypress to be used in combination with [`@jscutlery/cypress-mount`](https://github.com/jscutlery/test-utils/tree/main/packages/cypress-mount).

It can be enabled by adding the configuration below to the `*-e2e/src/plugins/index.ts` file:

```ts
import { startAngularDevServer } from '@jscutlery/cypress-angular-dev-server';

module.exports = (on, config) => {
  on('dev-server:start', (options) =>
    startAngularDevServer({ options, tsConfig: 'tsconfig.cypress.json' })
  );
  return config;
};
```
