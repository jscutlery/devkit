import type { Config } from '@swc/core';

export interface AngularPresetOptions {
  templateRawSuffix?: boolean;
}

export function swcAngularPreset(options: AngularPresetOptions = {}): Config {
  return {
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
        plugins: [
          [
            '@jscutlery/swc-plugin-angular',
            {
              templateRawSuffix: options.templateRawSuffix,
            } as SwcPluginAngularOptions,
          ],
        ],
      },
    },
  };
}

export function swcAngularJestTransformer(): [string, Record<string, unknown>] {
  return ['@swc/jest', swcAngularPreset() as Record<string, unknown>];
}

export function swcAngularVitePreset() {
  return swcAngularPreset({
    templateRawSuffix: true,
  });
}

interface SwcPluginAngularOptions {
  templateRawSuffix?: boolean;
}

/**
 * @deprecated Use {@link swcAngularVitePreset}, {@link swcAngularJestTransformer} or {@link swcAngularPreset} instead.
 */
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
      plugins: [
        ['@jscutlery/swc-plugin-angular', {} satisfies SwcPluginAngularOptions],
      ],
    },
  },
} satisfies Config;
