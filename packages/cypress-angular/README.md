# Cypress Angular

`@jscutlery/cypress-angular` brings Angular support to [Cypress Component Testing](https://docs.cypress.io/guides/component-testing/introduction.html#What-is-Cypress-Component-Testing).

It is aiming to make Cypress Component Testing with Angular easier than writing code without tests 😜.

## Features

✅ A simple `mount` function to test any of your components.

✅ Mount options allow you to override style, providers, modules, child components...

✅ Easy setup using Angular CLI schematics or [Nx](https://nx.dev/) generators.

✅ Using webpack configuration from Angular CLI to get the closest symmetry to production build. (i.e. no webpack hacks & less trouble)

✅ Angular builder & Nx executor to run Cypress Component Tests.

# Demo

[Demo](https://user-images.githubusercontent.com/2674658/118695305-554b0e80-b80d-11eb-83e2-a1066e852f89.mp4)

# Setup


Using Angular CLI: 

```sh
ng add @jscutlery/cypress-angular
ng g @jscutlery/cypress-angular:setup-ct --project my-project

npx ngcc

ng run my-project:ct
```

Using Nx:

```sh
npm i -D @jscutlery/cypress-angular
nx g @jscutlery/cypress-angular:setup-ct --project my-project

npx ngcc

nx run my-project:ct
```

## Usage

Add your `.cy-spec.ts` files in the e2e folder's `*-e2e/src/components`:

```ts
import { mount } from '@jscutlery/cypress-angular/mount';

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
import { mount } from '@jscutlery/cypress-angular/mount';

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
import { mountStory } from '@jscutlery/cypress-angular/mount';
import { Default } from './hello.stories.ts';

describe('HelloCompanent', () => {
  beforeEach(() => mountStory(Default));

  it('should show some love', () => {
    cy.get('h1').contains('❤️');
  });
});
```
