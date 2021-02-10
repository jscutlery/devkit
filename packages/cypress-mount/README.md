# Cypress Mount

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

```shell
yarn add -D @jscutlery/cypress-mount @jscutlery/cypress-angular-preprocessor

# or

npm install -D @jscutlery/cypress-mount @jscutlery/cypress-angular-preprocessor
```

### 2. Enable Cypress Component Testing

2.a. You can enable Cypress Component Testing by updating `cypress.json`:

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
const {
  angularPreprocessor,
} = require('@jscutlery/cypress-angular-preprocessor');

module.exports = (on, config) => {
  on('file:preprocessor', angularPreprocessor(config));
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
