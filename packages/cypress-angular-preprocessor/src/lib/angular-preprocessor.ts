import * as webpackPreprocessor from '@cypress/webpack-preprocessor';
import {
  AngularCompilerPlugin,
  AngularCompilerPluginOptions,
} from '@ngtools/webpack';
import { resolve } from 'path';

/**
 * @param cypressConfig Cypress config
 * @param angularCompilerOptions Angular compiler options.
 * Cf. {@link https://github.com/angular/angular-cli/tree/master/packages/ngtools/webpack#options}
 */
export function angularPreprocessor(
  cypressConfig,
  {
    angularCompilerOptions = {},
  }: {
    angularCompilerOptions?: Partial<AngularCompilerPluginOptions>;
  } = {}
) {
  return webpackPreprocessor({
    webpackOptions: {
      resolve: {
        extensions: ['.js', '.ts'],
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            loader: '@ngtools/webpack',
          },
        ],
      },
      plugins: [
        new AngularCompilerPlugin({
          directTemplateLoading: true,
          tsConfigPath: resolve(cypressConfig.projectRoot, 'tsconfig.e2e.json'),
          sourceMap: true,
          ...angularCompilerOptions,
        }),
      ],
    },
    /* @hack fixes error TS4058: Return type of exported function has or is using name
     * 'FileEvent' from external module "/node_modules/@cypress/webpack-preprocessor/dist/index"
     * but cannot be named. */
  }) as unknown;
}
