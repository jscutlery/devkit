# Cypress Mount

This is a thin wrapper around [cypress-angular-unit-test](https://github.com/bahmutov/cypress-angular-unit-test) aiming to provide a more convenient API.

It is aiming to make Cypress Component Testing with Angular easier than writing code without tests 😜.

## Cypress Component Testing

[Cypress Component Testing](https://docs.cypress.io/guides/component-testing/introduction.html#What-is-Cypress-Component-Testing) is the missing balance between component unit-testing and pure e2e testing.

It will help you enjoy both the benefits of unit-tests isolation and Cypress tooling & Developer eXperience.

## Setup

### 0. Use NX

Cypress Component Testing *(and everything else)* is easier with [Nx](https://nx.dev/latest/angular/getting-started/why-nx).

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
yarn add -D @jscutlery/cypress-mount cypress-angular-unit-test

# or

npm install -D @jscutlery/cypress-mount cypress-angular-unit-test
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

## Usage

Add your `.spec.ts` files in the e2e folder's `*-e2e/src/components`:

```ts
describe('HelloCompanent', () => {
  beforeEach(() => {
    setupAndMount(HelloComponent, {
      styles: [
        `body { background: purple}`
      ],
      imports: [HelloModule]
    });
  });

  it('should show some love', () => {
    cy.get('h1').contains('❤️');
  });
});
```
