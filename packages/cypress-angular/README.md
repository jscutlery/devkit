# Cypress Angular

**⚠️ THIS PACKAGE IS NOW DEPRECATED, SINCE CYPRESS 10, YOU SHOULD PREFER USING THE OFFICIAL PACKAGE [`cypress/angular`](https://github.com/cypress-io/cypress/tree/develop/npm/angular)**

**👉 but don't forget to check out our Angular CDK Harness support with [@jscutlery/cypress-harness](../cypress-harness) 👈**

Last version's source code: [cypress-angular-0.9.22](https://github.com/jscutlery/devkit/tree/37bd902c2e369be901a38d9704ae613155b5a594)

<hr>

`@jscutlery/cypress-angular` brings Angular support to [Cypress Component Testing](https://docs.cypress.io/guides/component-testing/introduction.html#What-is-Cypress-Component-Testing).

It is aiming to make Cypress Component Testing with Angular easier than writing code without tests 😜.

## 🪄 Features

✅ A simple `mount` function to test any of your components.

✅ Mount options allow you to override style, providers, modules, child components...

✅ Easy setup using Angular CLI schematics or [Nx](https://nx.dev/) generators.

✅ Using webpack configuration from Angular CLI to get the closest symmetry to production build. (i.e. no webpack hacks & less trouble)

✅ Angular builder & Nx executor to run Cypress Component Tests.

# 🤹🏻‍♂️ Demo

[Demo](https://user-images.githubusercontent.com/2674658/118695305-554b0e80-b80d-11eb-83e2-a1066e852f89.mp4)

# Table of Contents

- [Cypress Angular](#cypress-angular)
  - [🪄 Features](#-features)
- [🤹🏻‍♂️ Demo](#️-demo)
- [Table of Contents](#table-of-contents)
- [✨ Usage](#-usage)
  - [Mount a component](#mount-a-component)
  - [Mount a template](#mount-a-template)
  - [Mount a component with inputs](#mount-a-component-with-inputs)
  - [Mount a component with outputs](#mount-a-component-with-outputs)
  - [Storybook (and Component Story Format) support](#storybook-and-component-story-format-support)
  - [Destroy the component](#destroy-the-component)
- [🛠 Setup](#-setup)

# ✨ Usage

## Mount a component

Add your `.cy-spec.ts` files in the e2e folder's `*-e2e/src/components`:

```ts
import { mount } from '@jscutlery/cypress-angular/mount';

describe(HelloComponent.name, () => {
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
describe(HelloComponent.name, () => {
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

## Mount a component with inputs

```ts
describe(HelloComponent.name, () => {
  beforeEach(() => {
    mount(HelloComponent, {
      inputs: {
        message: '❤️',
      },
    });
  });

  it('should show some love', () => {
    cy.get('h1').contains('❤️');
  });
});
```

## Mount a component with outputs

```ts
describe(NameComponent.name, () => {
  it('should trigger output', () => {
    const { nameChangeStub } = mountComponent();
    cy.get('input').type('Foo');
    cy.wrap(nameChangesStub).should('be.calledOnceWith', 'Foo');
  });

  function mountComponent() {
    const nameChangeStub = cy.stub();
    mount(NameComponent, {
      inputs: {
        nameChange: nameChangeStub,
      },
    });
    return { nameChangeStub };
  }
});
```

## Storybook (and Component Story Format) support

You can also mount Storybook stories:

```ts
import { mountStory } from '@jscutlery/cypress-angular/mount';
import { Default } from './hello.stories.ts';

describe(HelloComponent.name, () => {
  beforeEach(() => mountStory(Default));

  it('should show some love', () => {
    cy.get('h1').contains('❤️');
  });
});
```

## Destroy the component

If you want to destroy the component manually to test some tear down logic, you can use the `destroy` function:

```ts
import { destroy, mount } from '@jscutlery/cypress-angular/mount';

describe(HelloComponent.name, () => {
  beforeEach(() => {
    mount(`<jc-hello></jc-hello>`, {
      imports: [HelloModule],
    });
  });

  it('should show alert when destroyed', () => {
    destroy();
    cy.window().its('alert').should('be.called');
  });
});
```

# 🛠 Setup

Using Angular CLI:

```sh
ng add @jscutlery/cypress-angular
ng g @jscutlery/cypress-angular:setup-ct --project my-project

npx ngcc

ng run my-project:ct
```

Using [Nx](https://nx.dev/):

```sh
npm i -D @jscutlery/cypress-angular
nx g @jscutlery/cypress-angular:setup-ct --project my-project

npx ngcc

nx run my-project:ct
```
