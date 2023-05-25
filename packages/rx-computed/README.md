# `@jscutlery/rx-computed`

# Installation

```sh
yarn add @jscutlery/rx-computed

# or

npm install @jscutlery/rx-computed
```

# `rxComputed`

## Usage
```typescript
import { rxComputed } from '@jscutlery/rx-computed';

@Component({
  ...
  template: `
    <mc-keywords-input (keywordsChange)="keywords.set($event)"/>
    <mc-sort-input (sortChange)="sort.set($event)"/>
    <mc-recipes-list [recipes]="recipes()"/>
  `
})
class MyCmp {
  keywords = signal<string | undefined>(undefined);
  sort = signal<'asc' | 'desc'>('desc');

  recipes = rxComputed(() => repo.getRecipes(keywords(), sort()), {initialValue: []});
}
```

## Motivation

Synchronously computed signals in Angular are relatively straight forward.  However, when dealing with an asynchronous source of data like an `Observable`, there is no primitive to derive a signal from it.

There are two common ways of dealing with this:

1. Using `@angular/core/rxjs-interop` which requires us to explicitly define the dependencies of the computed signal:

```typescript
// Signals
const keywords = signal(...);
const sort = signal(...);

// Signals => RxJS
const recipes$ = combineLatest({
  keywords: toObservable(keywords),
  sort: toObservable(sort)
}).pipe(
  switchMap(({ keywords, sort }) => repo.getRecipes(keywords, sort))
);

// RxJS => Signals
const recipes = toSignal(recipes$, []);
```

2. Using `effet` explicitly _(which is not the recommended way of using it, cf. https://angular.io/guide/signals#when-not-to-use-effects)_:

```typescript
const keywords = signal(...);
const sort = signal(...);

const recipes = signal(...);

effect((onCleanup) => {
  const sub = repo.getRecipes(keywords(), sort())
    .subscribe(_recipes => recipes.set(_recipes));

  onCleanup(() => sub.unsubscribe());
});
```

## FAQ

### What about errors?

Cf. [Managing RxJS Traffic with Signals and Suspensify](https://marmicode.io/blog/managing-rxjs-traffic-with-signals)

Cf. [@jscutlery/operators#suspensify](../operators/README.md#suspensify)