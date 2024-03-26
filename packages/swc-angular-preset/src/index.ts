import type { Config } from '@swc/core';

export default {
  jsc: {
    parser: {
      syntax: 'typescript',
      decorators: true,
      dynamicImport: true,
    },
    transform: {
      legacyDecorator: true,
      decoratorMetadata: true,
    },
    target: 'esnext',
    experimental: {
      plugins: [['@jscutlery/swc-plugin-angular', {}]],
    },
  },
} satisfies Config;
