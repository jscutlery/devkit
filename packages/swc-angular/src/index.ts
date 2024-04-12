import type { Config } from '@swc/core';
import { version as swcCoreVersion } from '@swc/core';

assertCompatibleSwcCoreVersion();

export interface AngularPresetOptions {
  templateRawSuffix?: boolean;
}

export function swcAngularPreset(options: AngularPresetOptions = {}) {
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
            '@jscutlery/swc-angular-plugin',
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
  } satisfies Config;
}

export function swcAngularJestTransformer(): [string, Record<string, unknown>] {
  return ['@swc/jest', swcAngularPreset()];
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

function assertCompatibleSwcCoreVersion() {
  if (!swcCoreVersion.startsWith('1.4.')) {
    console.error(`
    @swc/core version ${swcCoreVersion} is incompatible with @jscutlery/swc-angular.
    Please use @swc/core version 1.4.x.
    > npm add -D @swc/core@~1.4.0
    `);
    process.exit(1);
  }
}
