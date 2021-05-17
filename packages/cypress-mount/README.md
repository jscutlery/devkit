# Cypress Mount

This package is now internal, please use [`@jscutlery/cypress-angular`](../../packages/cypress-angular) instead.

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
ng add @nrwl/workspace
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

Add your `.spec.ts` files in the e2e folder's `*-e2e/src/components`:

```ts
describe('HelloCompanent', () => {
  beforeEach(() => {
    mount(HelloComponent, {
      styles: [`body { background: purple}`],
      imports: [HelloModule],
    });
  });

  it('should show some love', () => {
    cy.get('h1').contains('❤️');
  });
});
```

## Mount a template

```ts
describe('HelloCompanent', () => {
  beforeEach(() => {
    mount(`<jc-hello></jc-hello>`, {
      imports: [HelloModule],
    });
  });

  it('should show some love', () => {
    cy.get('h1').contains('❤️');
  });
});
```

## Storybook (and Component Story Format) support

You can also mount Storybook stories:

```ts
import { Default } from './hello.stories.ts';

describe('HelloCompanent', () => {
  beforeEach(() => mountStory(Default));

  it('should show some love', () => {
    cy.get('h1').contains('❤️');
  });
});
```

## Execute tests

Execute component tests using the Cypress CLI:

```bash
cypress run-ct --project apps/my-app

# or

cypress open-ct --project apps/my-app
```
