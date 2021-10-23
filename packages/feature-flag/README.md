# @jscutlery/feature-flag

Module for providing feature flags.

## Usage

You need to import the modules with the feature definition:

```js
imports: [
  FeatureFlagModule.forRoot({
    THE_GOOD_STUFF: true,
    THE_BAD_STUFF: false,
  }),
];
```

Then you can use it in templates:


```html
<div *jscFeatureToggle="'THE_GOOD_STUFF'">the good stuff</div>
```

At route level:

```js
const routes: Routes = [
  {
    path: 'weather',
    component: WeatherComponent,
    canActivate: [FeatureFlagGuard],
    data: {
      feature: 'WEATHER',
      redirectTo: '/home',
    },
  },
];
```

Note that the guard checks for the `route.data.feature` and fallback to `route.path` to know wether the feature is enabled or not. You can specify a `route.data.redirectTo` property that will be used if the feature is not enabled.
