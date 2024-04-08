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
    env: {
      include: ['transform-async-to-generator'],
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

export function swcAngularUnpluginOptions(): Config & {
  tsconfigFile?: boolean;
} {
  return {
    ...swcAngularVitePreset(),
    /* Since we are using SWC's env option, we need to disable the tsconfigFile option.
     * Otherwise `unpluggin-swc` will try to use the target from the tsconfig's `compilerOptions`,
     * and make SWC produce the following error: "`env` and `jsc.target` cannot be used together".
     *
     * We could have added this extra option to `swcAngularVitePreset`, but forwarding any extra option
     * to SWC will make SWC's configuration parser fail.
     *
     * Cf.  https://github.com/unplugin/unplugin-swc/issues/137 */
    tsconfigFile: false,
  };
}

interface SwcPluginAngularOptions {
  templateRawSuffix?: boolean;
}

/**
 * @deprecated Use {@link swcAngularVitePreset}, {@link swcAngularJestTransformer} or {@link swcAngularPreset} instead.
 */
export default swcAngularPreset();
