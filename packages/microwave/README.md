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
- [📝 Usage](#-usage)
  - [`@Microwave`](#microwave-1)
  - [`@Microwave` + `watch`](#microwave--watch)
  - [Upcoming features](#upcoming-features)
    - [Nuke it](#nuke-it)

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

## Upcoming features

- [ ] `watch` multiple properties
- [ ] provide multiple Microwave strategies
- [ ] automatically unsubscribe even when using operators with `watch(...).pipe(...)`

### Nuke it

Wordplay by [@AlyssaNicoll](https://twitter.com/AlyssaNicoll) & [@schwarty](https://twitter.com/schwarty).

Cf. Angular Air [https://youtu.be/CmspcYY6jjU](https://youtu.be/CmspcYY6jjU)
