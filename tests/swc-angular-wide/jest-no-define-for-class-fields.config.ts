/** @jest-config-loader ts-node */
import type { Config } from 'jest';

import { swcAngularJestTransformer } from '@jscutlery/swc-angular';
import baseConfig from './jest.config';

/* Angular CLI projects default to `useDefineForClassFields: false`. */
export default {
  ...baseConfig,
  displayName: 'demo (useDefineForClassFields: false)',
  transform: {
    ...baseConfig.transform,
    '^.+\\.(ts|mjs|js)$': swcAngularJestTransformer({
      useDefineForClassFields: false,
    }),
  },
} satisfies Config;
