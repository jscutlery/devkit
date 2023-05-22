# Cypress Mount

**⚠️ THIS PACKAGE IS NOW DEPRECATED, SINCE CYPRESS 10, YOU SHOULD PREFER USING THE OFFICIAL PACKAGE [`cypress/angular`](https://github.com/cypress-io/cypress/tree/develop/npm/angular)**

**👉 but don't forget to check out our Angular CDK Harness support with [@jscutlery/cypress-harness](../cypress-harness) 👈**

Last version's source code: [cypress-mount-0.12.7](https://github.com/jscutlery/devkit/tree/3d7519f2ed1cf964c3cf86cd6a57f70ee57680ec)

<hr>

This module brings Angular support to [Cypress Component Testing](https://docs.cypress.io/guides/component-testing/introduction.html#What-is-Cypress-Component-Testing).

It is aiming to make Cypress Component Testing with Angular easier than writing code without tests 😜.

## Cypress Component Testing

[Cypress Component Testing](https://docs.cypress.io/guides/component-testing/introduction.html#What-is-Cypress-Component-Testing) is the missing balance between component unit-testing and pure e2e testing.

It will help you enjoy both the benefits of unit-tests isolation and Cypress tooling & Developer eXperience.

## Setup

### 0. Use NX

Cypress Component Testing _(and everything else)_ is easier with [Nx](https://nx.dev/latest/angular/getting-started/why-nx).

If you are writing a new app, you can create a Nx workspace with the following command:

```shell
yarn create nx-workspace # or npm init nx-workspace
```

... otherwise, you can migrate to Nx using:

```shell
ng add @nx/workspace
```

### 1. Install

The following install guide targets Cypress >= 7, follow [this guide](./docs/experimental-install.md) for Cypress < 7.

```shell
yarn add -D @jscutlery/cypress-mount @jscutlery/cypress-angular-dev-server @cypress/webpack-dev-server html-webpack-plugin

# or

npm install -D @jscutlery/cypress-mount @jscutlery/cypress-angular-dev-server @cypress/webpack-dev-server html-webpack-plugin
```

### 2. Enable Cypress Component Testing

2.a. Enable Cypress Component Testing by updating `cypress.json`:

```json
{
  ...
  "component": {
    "testFiles": "**/*.spec.{js,ts,jsx,tsx}",
    "componentFolder": "./src/components"
  }
}
```

2.b. Update the `include` property in `tsconfig.json` file:

```json
{
  ...
  "include": ["src/components/**/*.ts", "src/support/**/*.ts"],
}
```

2.c. Import support commands by updating e2e folder's `*-e2e/src/support/index.ts` and adding:

```ts
import '@jscutlery/cypress-mount/support';
```

2.d. Setup Angular Dev Server in `*-e2e/src/plugins/index.ts`, in order to build angular components (e.g. handle templateUrl etc...):

```ts
import { startAngularDevServer } from '@jscutlery/cypress-angular-dev-server';

module.exports = (on, config) => {
  on('dev-server:start', (options) =>
    startAngularDevServer({ config, options })
  );
  return config;
};
```

## Usage

Cf. [`@jscutlery/cypress-angular`](../../packages/cypress-angular)
