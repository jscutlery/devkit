# @jscutlery/swc-angular-preset

SWC preset for testing Angular projects in conjunction with [`@jscutlery/swc-plugin-angular`](packages/swc-plugin-angular) and `@swc/jest`.

## Installation

Install this preset and its dependencies via npm:

```bash
npm install @jscutlery/swc-angular-preset @jscutlery/swc-plugin-angular @swc/core @swc/jest -D
```

## Usage

In your Jest configuration file (e.g., `jest.config.js`), include `@swc/jest` and `@jscutlery/swc-angular-preset` in the list of transformers:

```js
import swcAngularPreset from '@jscutlery/swc-angular-preset';

export default {
  transform: {
    '^.+\\.(ts|mjs|js)$': ['@swc/jest', swcAngularPreset],
    '^.+\\.(html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
};
```

For TypeScript, JavaScript, and MJS (ES module) files, `@swc/jest` is used for transformation which ensures efficient transformation of files in your Angular project.
