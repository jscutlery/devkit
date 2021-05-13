# Cypress Angular Dev Server

This is a helper for starting a Cypress 7+ dev server for Angular.
It is used to build components in Cypress to be used in combination with [`@jscutlery/cypress-mount`](https://github.com/jscutlery/test-utils/tree/main/packages/cypress-mount) in order to build Angular components.

It can be enabled by adding the configuration below to the `*-e2e/src/plugins/index.js` file:

```ts
import { startAngularDevServer } from '@jscutlery/cypress-angular-dev-server';

module.exports = (on, config) => {
  on('dev-server:start', (options) =>
    startAngularDevServer({ config, options })
  );
  return config;
};
```

Declare component tests in the `cypress.json` file:

```json
{
  "component": {
    "testFiles": "**/*.spec.{js,ts,jsx,tsx}",
    "componentFolder": "./src/components"
  }
}
```

Update the `include` property in the `tsconfig.json` file:

```json
{
  "include": ["src/components/**/*.ts", "src/support/**/*.ts"],
}
```

Execute component tests using :

```bash
cypress run-ct --project apps/my-app
# or
cypress open-ct --project apps/my-app
```
