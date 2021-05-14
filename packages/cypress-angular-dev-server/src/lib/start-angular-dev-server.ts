/// <reference types="cypress"/>
import { startDevServer } from '@cypress/webpack-dev-server';
import { ResolvedDevServerConfig } from '@cypress/webpack-dev-server';
import { AngularWebpackPlugin } from '@ngtools/webpack';

export async function startAngularDevServer({
  config,
  options,
}: {
  config: Cypress.PluginConfigOptions;
  options: Cypress.DevServerOptions;
}): Promise<ResolvedDevServerConfig> {
  return startDevServer({
    options,
    webpackConfig: {
      /* Performance boost. */
      devtool: false,
      resolve: {
        extensions: ['.js', '.ts'],
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            loader: '@ngtools/webpack',
          },
          /* Use raw-loader as AngularCompilerPlugin handles the rest. */
          {
            test: /\.css$/,
            loader: 'raw-loader',
          },
          /* Use raw-loader as AngularCompilerPlugin handles the rest. */
          {
            test: /\.scss$/,
            use: ['raw-loader', 'sass-loader'],
          },
        ],
      },
      plugins: [
        new AngularWebpackPlugin({
          directTemplateLoading: true,
          tsconfig: 'tsconfig.json',
        }),
      ],
    },
  });
}
