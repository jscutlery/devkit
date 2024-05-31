import { dirname, join } from 'node:path';
import type { Options } from '@swc/core';
import { version } from '@swc/core';
import { fileSystem } from './utils';

assertCompatibleSwcCoreVersion(version);

export interface AngularPresetOptions {
  styleInlineSuffix?: boolean;
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
              styleInlineSuffix: options.styleInlineSuffix,
              templateRawSuffix: options.templateRawSuffix,
            } as SwcPluginAngularOptions,
          ],
        ],
      },
    },
    env: {
      include: ['transform-async-to-generator'],
    },
    swcrc: false,
  } satisfies Options;
}

export function swcAngularJestTransformer(): [string, Record<string, unknown>] {
  return ['@swc/jest', swcAngularPreset()];
}

export function swcAngularVitePreset() {
  return swcAngularPreset({
    styleInlineSuffix: true,
    templateRawSuffix: true,
  });
}

export function swcAngularUnpluginOptions(): Options & {
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
  styleInlineSuffix?: boolean;
  templateRawSuffix?: boolean;
}

/**
 * @deprecated Use {@link swcAngularVitePreset}, {@link swcAngularJestTransformer} or {@link swcAngularPreset} instead.
 */
export default swcAngularPreset();

function assertCompatibleSwcCoreVersion(version: string) {
  /* Fallback to reading version from package.json when not exported.
   * This happens on Stackblitz. */
  if (version == undefined) {
    const packageJsonPath = join(
      dirname(require.resolve('@swc/core')),
      'package.json',
    );
    version = fileSystem.readJsonFile<{
      version: string;
    }>(packageJsonPath).version;
  }

  if (!(version.startsWith('1.4.') || version.startsWith('1.5.') || version.startsWith('1.6.'))) {
    console.error(`
    @swc/core version ${version} is incompatible with @jscutlery/swc-angular.
    Please use @swc/core version 1.4.x or 1.5.x. or 1.6.x
    > npm add -D @swc/core@~1.5.0
    `);
    process.exit(1);
  }
}
