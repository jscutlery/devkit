# Cypress Harness

## The Background Story

Both unit-testing and e2e testing can get tricky when it comes to interacting with the DOM. In fact, **tests have to be decoupled from the implementation details of the code they test**. Especially if you are interacting with same components of an app in different tests.

This often happens with UI libraries like [Angular Material](https://material.angular.io/) and that is why the Angular Material's team came up with the amazing idea of creating a testing abstraction layer over components called [Component Test Harnesses](https://material.angular.io/cdk/test-harnesses/overview).

One of the most interesting ideas behind Component Test Harnesses is that they are also meant to be platform agnostic, which means they can be used in your unit-tests with Jest or Karma, in your e2e tests with Protractor or Cypress or in your [Cypress Component Tests](../cypress-mount/README.md).

**This library provides Cypress support to Component Test Harnesses.**

## Setup

### 1. Install

```shell
yarn add -D @jscutlery/cypress-harness @angular/cdk cypress-pipe 

# or 
 
npm install -D @jscutlery/cypress-harness @angular/cdk cypress-pipe
```

### 2. Import support commands

Update your e2e folder's `*-e2e/src/support/index.ts` and add:

```ts
import '@jscutlery/cypress-harness/support';
```

## Usage

```ts
describe('cypress-harness', () => {
  const datepicker = MatDatepickerInputHarness;

  beforeEach(() => ...);

  it('should set date using material datepicker harness', () => {
    getHarness(datepicker).invoke('setValue', '1/1/2010');
    getHarness(datepicker).invoke('openCalendar');
    getHarness(datepicker).invoke('getCalendar').invoke('next');
    getHarness(datepicker)
      .invoke('getCalendar')
      .invoke('selectCell', { text: '10' });
    getHarness(datepicker).invoke('getValue').should('equal', '2/10/2010');
    getAllHarnesses(MatCalendarHarness).should('be.empty');
  });
});
```


> ⚠️ WARNING: never re-use the value returned by `getRootHarness`, `getHarness` or `getAllHarnesses`.
