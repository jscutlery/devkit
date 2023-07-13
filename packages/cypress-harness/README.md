# Cypress Harness

## The Background Story

Both unit-testing and e2e testing can get tricky when it comes to interacting with the DOM. In fact, **tests have to be decoupled from the implementation details of the code they test**. Especially if you are interacting with same components of an app in different tests.

This often happens with UI libraries like [Angular Material](https://material.angular.io/) and that is why the Angular Material's team came up with the amazing idea of creating a testing abstraction layer over components called [Component Test Harnesses](https://material.angular.io/cdk/test-harnesses/overview).

One of the most interesting ideas behind Component Test Harnesses is that they are also meant to be platform agnostic, which means they can be used in your unit-tests with Jest or Karma, in your e2e tests with Protractor or Cypress or in your [Cypress Component Tests](../cypress-mount/README.md).

**This library provides Cypress support to Component Test Harnesses.**

![Angular Material Datepicker Harness in Cypress](./cypress-harness.gif)

## Setup

### 1. Install

```shell
yarn add -D @jscutlery/cypress-harness @angular/cdk cypress-pipe

# or

npm install -D @jscutlery/cypress-harness @angular/cdk cypress-pipe
```

### 2. Setup

#### 2.a. Cypress E2E

Update your e2e folder's `cypress/support/e2e.ts` and add:

```ts
import '@jscutlery/cypress-harness/support';
```

then update the `cypress.config.ts` file as follows:

```ts
import { defineConfig } from 'cypress';
import { getPreprocessorConfig } from '@jscutlery/cypress-harness/src/preprocessor-config';

export default defineConfig({
  e2e: {
    // ... other existing settings if any (like nxE2EPreset() if using Nx).
    ...getPreprocessorConfig(),
  },
});
```

This last part is needed to add support for [package exports conditionals](https://nodejs.org/api/packages.html#conditional-exports)
and allow us to import harnesses from `@angular/cdk/testing` for example.

#### 2.b. Cypress Component Testing

If you are using Cypress Component Testing then there is a different import to add to the following file: `cypress/support/component.ts`:

```ts
import '@jscutlery/cypress-harness/support-ct';
```

_(the `getPreprocessorConfig()` is not required here as it is already set up by `cypress/angular`.)_

## Usage

```ts
describe('datepicker', () => {
  /* getHarness & getAllHarnesses are lazy so you can
   * initialize them wherever you want and reuse them. */
  const datepicker = getHarness(MatDatepickerInputHarness);
  const calendars = getAllHarnesses(MatCalendarHarness);

  it('should set date', () => {
    cy.visit('/'); // or cy.mount(MyComponent); for component testing.
    datepicker.setValue('1/1/2010');
    datepicker.openCalendar();
    datepicker.getCalendar().then((harness) => harness.next()); // next method is already used
    datepicker.getCalendar().selectCell({ text: '10' });
    datepicker.getValue().should('equal', '2/10/2010');
    calendars.should('be.empty');
  });
});
```
