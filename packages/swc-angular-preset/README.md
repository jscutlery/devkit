# ⚡️ Speed Up Jest Angular Testing with SWC 🦀

## What is this?

This is Angular preset for [SWC's (Speedy Web Compiler)](https://swc.rs/) Jest
transformer [`@swc/jest`](https://swc.rs/docs/usage/jest).

**Switching to SWC can speed up your Jest tests by 2x to 5x (compared to ts-jest).**

## Context

Surprisingly, in most cases, the bottleneck in Jest tests is not the test execution time nor the Angular JIT
(Just-In-Time) compiler but the TypeScript transformer _(i.e. `ts-jest`)_.

This is where SWC (Speedy Web Compiler) comes in. SWC is a JavaScript/TypeScript compiler that aims to be extremely
fast.

This preset enables you to use SWC with Angular projects by setting the right configuration for SWC and using
our Angular plugin for SWC [`@jscutlery/swc-plugin-angular`](../swc-plugin-angular)

## 🛠 Setup

### 1. Install

Install this preset and its dependencies via npm:

```bash
npm install @jscutlery/swc-angular-preset @jscutlery/swc-plugin-angular @swc/core @swc/jest -D
```

### 2. Configure

In your Jest configuration file (e.g., `jest.config.ts`), include `@swc/jest` and `@jscutlery/swc-angular-preset` in the
list of transformers:

```js
import swcAngularPreset from '@jscutlery/swc-angular-preset';

export default {
  // ...
  transform: {
    '^.+\\.(ts|mjs|js)$':
      ['@swc/jest', swcAngularPreset],
    '^.+\\.(html)$':
      [
        'jest-preset-angular',
        {
          tsconfig: '<rootDir>/tsconfig.spec.json',
          stringifyContentPathRegex: '\\.(html|svg)$',
        },
      ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  // ...
};
```
