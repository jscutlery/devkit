# Microwave

`@jscutlery/microwave` brings simplified and performant reactivity to Angular.

# 🪄 Features

⚡️ Less change detection: Microwave will only trigger change detection when properties change.

😌 Less RxJS Spaghetti: Focus on your features without sacrificing performance.

🚦 Coalescing: regroup changes and trigger change detection once per component.

✅ Microwave is ZoneJS agnostic so it will work with or without it.

👯‍♀️ Don't trigger useless change detections when a property's value has been set to the same value.

# Table of Contents

- [Microwave](#microwave)
- [🪄 Features](#-features)
- [Table of Contents](#table-of-contents)
- [👾 Demo](#-demo)
- [📝 Usage](#-usage)
  - [`@Microwave`](#microwave-1)
  - [`@Microwave` + `watch`](#microwave--watch)
  - [Change detection strategies](#change-detection-strategies)
    - [Custom strategies.](#custom-strategies)
  - [Upcoming features](#upcoming-features)
- [Acknowledgements](#acknowledgements)
  - [Nuke it](#nuke-it)

# 👾 Demo

https://stackblitz.com/edit/game-of-life-microwave?file=src%2Fapp%2Fcell.component.ts

# 📝 Usage

## `@Microwave`

Just add the `@Microwave` decorator and let it [nuke](#nuke-it) your component!

```ts
import { Microwave } from '@jscutlery/microwave';

@Microwave()
@Component({
  template: `...`,
})
class GreetingsComponent {
  /* ⚠️ Important: properties should be initialized, otherwise they won't be detected by Microwave. */
  name?: string = undefined;
}
```

## `@Microwave` + `watch`

Watch property changes.

```ts
@Microwave()
@Component({
  template: `<h1>Welcome {{ upperCaseName }}</h1>`,
})
class GreetingsComponent {
  @Input() name?: string = undefined;
  upperCaseName?: string = undefined;

  constructor() {
    /* Note that you don't have to handle the subscription as the returned observable
     * will be unsubscribed from when the component is destroyed.
     * Though, if you add operators, you will have to handle subscriptions. */
    watch(this, 'name').subscribe((name) => {
      this.upperCaseName = name.toUpperCase();
    });
  }
}
```

## Change detection strategies

You can customize the change detection strategy using the `strategy` parameter.

```ts
@Microwave({
  strategy: asyncStrategy,
})
export class MyComponent {}
```

Here are the current strategies.

### Custom strategies.

You can implement your own strategy using the `Strategy<T>` signature.

| Strategy      | Description                                                                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| asapStrategy  | This is the default strategy. It will trigger change detection independently for each component while coalescing changes and scheduling the change detection on the microtask queue. |
| asyncStrategy | Local strategy coalescing using macrotasks                                                                                                                                           |
| rafStrategy   | Local strategy coalescing using `requestAnimationFrame`                                                                                                                              |
| syncStrategy  | Local strategy without coalescing so it will trigger change detection each time a property changes.                                                                                  |

## Upcoming features

- [ ] provide multiple Microwave strategies
- [ ] `watch` multiple properties
- [ ] automatically unsubscribe even when using operators with `watch(...).pipe(...)`

# Acknowledgements

The [RxAngular](https://github.com/rx-angular/rx-angular) team for the inspiration. In fact, the first prototype was built during the creation of the RxState Marmicode Tasting video: https://youtu.be/CcQYj4V2IKw

## Nuke it

Wordplay by [@AlyssaNicoll](https://twitter.com/AlyssaNicoll) & [@schwarty](https://twitter.com/schwarty).

Cf. Angular Air [https://youtu.be/CmspcYY6jjU](https://youtu.be/CmspcYY6jjU)
