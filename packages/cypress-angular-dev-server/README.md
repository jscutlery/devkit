# Cypress Angular Dev Server

**⚠️ THIS PACKAGE IS NOW DEPRECATED, SINCE CYPRESS 10, YOU SHOULD PREFER USING THE OFFICIAL PACKAGE [`cypress/angular`](https://github.com/cypress-io/cypress/tree/develop/npm/angular)**

**👉 but don't forget to check out our Angular CDK Harness support with [@jscutlery/cypress-harness](../cypress-harness) 👈**

Last version's source code: [cypress-angular-dev-server-1.7.18](https://github.com/jscutlery/devkit/tree/704bda57cfdb9062c237e75b54df9db1d8a67b3f)

<hr>

This is an internal package used by [`@jscutlery/cypress-angular`](https://github.com/jscutlery/devkit/tree/main/packages/cypress-angular).

It is a helper for starting a Cypress 7+ dev server for Angular. It is used to build components in Cypress to be used in combination with [`@jscutlery/cypress-mount`](https://github.com/jscutlery/devkit/tree/main/packages/cypress-mount).

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

## Custom Webpack configuration

It's possible to pass a custom Webpack configuration that will be merged with the Angular CLI configuration.

```ts
import { startAngularDevServer } from '@jscutlery/cypress-angular-dev-server';

module.exports = (on, config) => {
  on('dev-server:start', (options) =>
    startAngularDevServer({
      options,
      webpackConfig: { node: { global: true } },
    })
  );
  return config;
};
```
