# Playwright Component Testing for Angular _(experimental)_

This library brings **Angular support** to [Playwright's **experimental** Component Testing](https://playwright.dev/docs/test-components).

This will allow us to test our Angular components with Playwright without building the whole app and with more control.

`@jscutlery/playwright-ct-angular` currently supports:

- ✅ **Testing [Versatile Angular Components](https://marmicode.io/blog/versatile-angular)**
- 🎛 **Passing type-safe inputs to the tested components** 
- 🎭 **Spying on component outputs in a type-safe fashion**

# 🚀 Writing our first

First, we will have to set up Playwright Component Testing as [mentioned below](#setup).

⚠️ Make sure to check the [known limitations](#-known-limitations) before writing more tests.

## ✅ Basic Test

Then, we can write our first test in `.../src/greetings.component.pw.ts`:

```ts
import { expect, test } from '@jscutlery/playwright-ct-angular';
import { GreetingsComponent } from './greetings.component';

test('<jc-greetings> should be polite', async ({ mount }) => {
  const locator = await mount(GreetingsComponent);
  expect(locator).toHaveText('👋 Hello!');
});
```

## 🎛 Testing Inputs

```ts
import { expect, test } from '@jscutlery/playwright-ct-angular';
import { GreetingsComponent } from './greetings.component';

test('<jc-greetings> should be polite', async ({ mount }) => {
  const locator = await mount(GreetingsComponent, {inputs: {name: 'Edouard'}});
  expect(locator).toHaveText('👋 Hello Edouard!');
});
```

## 🎭 Spying on outputs

`mount()` will automatically create a `jest-mock`'s spy, subscribe to the outputs given through the `spyOutputs`
option and return them in the `spies` property, in a type-safe way showing only the outputs that are spied on.

Note that the `spyOutputs` is type-safe and will only allow properties that exist on the component.

```ts
import { expect, test } from '@jscutlery/playwright-ct-angular';
import { NameEditorComponent } from './name-editor.component';

test('<jc-name-editor> should be polite', async ({ mount }) => {
  const locator = await mount(NameEditorComponent, {spyOutputs: ['nameChange']});

  await locator.getByLabel('Name').type('Edouard');

  expect(locator.spies.nameChange).lastCalledWith('Edouard');
});
```

### Passing output callbacks

We can also pass custom output callback functions for some extreme cases or if we want to use a custom spy implementation for example or just debug.
```ts
await mount(NameEditorComponent, {
  outputs: {
    nameChange(name) {
      console.log(name);
    }
  }
});
```

## 🥸 Providing Test Doubles & Importing Additional Modules

Due to the [limitations described below](#-known-limitations), the recommended approach for providing test doubles
or importing additional modules is to create a test container component in another file.

```ts
// recipe-search.component.pw.ts
import { defer } from 'rxjs';
import { RecipeSearchTestContainer } from './recipe-search.test-container';

test('...', async ({ mount }) => {
  await mount(RecipeSearchTestContainer, {
    inputs: {
      recipes: [
        beer,
        burger
      ]
    }
  })
})

// recipe-search.test-container.ts
@Component({
  standalone: true,
  imports: [RecipeSearchComponent],
  template: '<jc-recipe-search></jc-recipe-search>',
  providers: [
    RecipeRepositoryFake,
    {
      provide: RecipeRepository,
      useExisting: RecipeRepositoryFake,
    },
  ],
})
export class RecipeSearchTestContainer {
  private _repo = inject(RecipeRepositoryFake);

  @Input() set recipes(recipes: Recipe[]) {
    this._repo.recipes = recipes;
  }
}

/* Cf. https://github.com/jscutlery/devkit/tree/main/tests/playwright-ct-angular-wide/src/testing/recipe-repository.fake.ts
 * for a better example. */
class RecipeRepositoryFake implements RecipeRepositoryDef {
  recipes: Recipe[] = [];

  searchRecipes() {
    return defer(() => of(this.recipes));
  }
}
```

## 🎨 Using Styles

### Shared Styles

In order to import styles that are shared between our tests, we can do so by importing them in `playwright/index.ts`.
We can also customize the shared `playwright/index.html` nearby.

### Specific Styles

If we want to load some specific styles for a single test, we might prefer using a test container component:
```ts
import styles from './some-styles.css';
@Component({
  template: '<jc-greetings></jc-greetings>',
  encapsulation: ViewEncapsulation.None,
  styles: [styles]
})
class GreetingsTestContainer {}
```

### Angular Material & Angular Libraries with styles

As mentioned in [Versatile Angular Style Blog Post](https://marmicode.io/blog/versatile-angular),
Angular Material and other Angular libraries might use a [Conditional "style" Export](https://nodejs.org/api/packages.html#conditional-exports)
that allows us to import prebuilt styles
_(Cf. [Angular Package Format](https://angular.io/guide/angular-package-format) [managing assets in a library](https://angular.io/guide/creating-libraries#managing-assets-in-a-library))_.

In that case, we can add the following configuration to our `playwright-ct.config.ts`:
```ts
const config: PlaywrightTestConfig = {
  // ...
  use: {
    // ...
    ctViteConfig: {
      resolve: {
        /* @angular/material is using "style" as a Custom Conditional export to expose prebuilt styles etc... */
        conditions: ['style']
      }
    }
  }
};
```

## More examples
Cf. [/tests/playwright-ct-angular-wide/src](https://github.com/jscutlery/devkit/tree/main/tests/playwright-ct-angular-wide/src)

# ⚠️ Known Limitations

The way Playwright Component Testing works is different from the way things work with Karma, Jest, Vitest, Cypress etc...
Playwright Component Testing tests run in a Node.js environment while the component is rendered in a browser.

This causes a couple of limitations as we can't directly access the `TestBed's` or the component's internals,
and we can only exchange serializable data with the component.

## 🪄 The Magic Behind the Scenes

The magical workaround behind the scenes is that at build time:
1. Playwright analyses all the calls to `mount()`,
2. it grabs the first parameter (the component class),
3. replaces the component class with a unique string (constructed from the component class name and es-module),
4. adds the component's es-module to Vite entrypoints,
5. and finally creates a map matching each unique string to the right es-module.

This way, when calling `mount()`, Playwright with communicate the unique string to the browser who will know which es-module to load.

Cf. https://youtu.be/y3YxX4sFJbM
Cf. https://github.com/microsoft/playwright/blob/cac67fb94f2c8a0ee82878054c39790e660f17ca/packages/playwright-test/src/tsxTransform.ts#L153

## It is currently impossible to...

### ...hold the component type in a variable

```ts
// 🛑 this won't work
const cmp = MyComponent;
await mount(cmp);
```

### ...use the component type elsewhere in the file.

```ts
// 🛑 this won't work
test(MyComponent.name, async ({ mount }) => {});
```

### ...declare components in the same file.

```ts
// 🛑 this won't work
@Component({...})
class GreetingsComponent {}

test('<jc-greetings>', async ({ mount }) => {
  await mount(GreetingsComponent);
});
```

### ...pass any symbol other than a component class
This makes the following impossible:
- passing providers to the `mount()` function
- passing modules to the `mount()` function (this is what currently makes the usage of mounting templates impossible)
- use non-standalone components

### ...use non-[Versatile Angular Style](https://marmicode.io/blog/versatile-angular)
We'll need a vite plugin to support traditional DI, external templates and stylesheets etc...

## 🔮 Future workarounds

If you really can't make it to [Versatile Angular Style](https://marmicode.io/blog/versatile-angular),
we can think of a couple of workarounds like using a vite plugin like **Brandon Roberts' [vite-plugin-angular](https://github.com/analogjs/analog/tree/main/packages/vite-plugin-angular)**

We could also implement some custom transform that registers the providers and import modules, like Playwright does for the component class.

# Setup

## 📦 Install

```sh
# You can run this command in an existing workspace.
yarn create playwright --ct # or npm init playwright@latest -- --ct

# Choose React

# ? Which framework do you use? (experimental) … 
# ❯ react
#  vue
#  svelte
#  solid

yarn add -D @jscutlery/playwright-ct-angular @playwright/test # or npm install -D @jscutlery/playwright-ct-angular @playwright/test
```

## 🛠 Configure

Update `playwright-ct-config.ts` and replace:
```ts
import type { PlaywrightTestConfig } from '@playwright/experimental-ct-react';
import { devices } from '@playwright/experimental-ct-react';
```

with

```ts
import type { PlaywrightTestConfig } from '@jscutlery/playwright-ct-angular';
import { devices } from '@jscutlery/playwright-ct-angular';
```

### Change tests extension

In order to avoid collisions with other tests (e.g. Jest / Vitest),
We can replace the default matching extension `.spec.ts` with `.pw.ts`:

```ts
const config: PlaywrightTestConfig = {
  testDir: './',
  testMatch: /pw\.ts$/,
  ...
}
```
