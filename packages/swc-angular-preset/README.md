# ⚡️ Speed Up Angular Testing with SWC 🦀

## 👀 What is this?

This is a set of Angular presets that enable you to use [SWC (Speedy Web Compiler)](https://swc.rs/) with Jest or
Vitest.

**Switching to SWC can speed up your tests by 2x to 5x.**

## 🤔 Context

Surprisingly, in most cases, the bottleneck in Jest & Vitest tests is not the test execution time nor the Angular JIT
(Just-In-Time) compiler but the TypeScript transformer.

This is where SWC (Speedy Web Compiler) comes in. SWC is a JavaScript/TypeScript compiler that aims to be extremely
fast.

This package enables you to use SWC with Angular projects by setting the right configuration for SWC and using
our Angular plugin for SWC [`@jscutlery/swc-plugin-angular`](../swc-plugin-angular)

## 🥇 Benchmark

| ts-jest | @swc/jest           |
|---------|---------------------|
| 85s     | 35s _(2.4x faster)_ |

💻 try it yourself: https://github.com/yjaaidi/experiments/tree/angular-jest-swc-benchmark

## 🎭 Setup with Jest

### 1. Install

Install this preset and its dependencies via npm:

```sh
npm install -D @jscutlery/swc-angular-preset @jscutlery/swc-plugin-angular @swc/core @swc/jest
grep .swc .gitignore || echo .swc >> .gitignore
```

### 2. Configure

In your Jest configuration file (e.g., `jest.config.ts`), use the `swcAngularJestTransformer` function to
transform `.ts`, `.js`, and `.mjs` files.

```js
import { swcAngularJestTransformer } from '@jscutlery/swc-angular-preset';

export default {
  // ...
  transform: {
    '^.+\\.(ts|mjs|js)$': swcAngularJestTransformer(),
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

## ⚡️Setup with Vitest

### 1. Install

Install this preset and its dependencies via npm:

```sh
npm install -D @jscutlery/swc-angular-preset @jscutlery/swc-plugin-angular @swc/core unplugin-swc
grep .swc .gitignore || echo .swc >> .gitignore
```

### 2. Configure

In your vite configuration file (e.g., `vite.config.ts`), use the `unplugin-swc` plugin with our
preset: `swcAngularVitePreset`.

```js
import { swcAngularVitePreset } from '@jscutlery/swc-angular-preset';
import swc from 'unplugin-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  // ...
  plugins: [swc.vite(swcAngularVitePreset())]
  // ...
});
```