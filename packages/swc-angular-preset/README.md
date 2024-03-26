# @jscutlery/swc-angular-preset

SWC preset for testing Angular projects in conjunction with `@swc/jest`.

## Installation

Install this preset via npm:

```bash
npm install @jscutlery/swc-angular-preset -D
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
