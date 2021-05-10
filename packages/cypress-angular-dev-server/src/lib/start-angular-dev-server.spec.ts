import { startAngularDevServer } from './start-angular-dev-server';

import { startDevServer } from '@cypress/webpack-dev-server';
import { AngularCompilerPlugin } from '@ngtools/webpack';

/* Import jest functions manually as they conflict with cypress
 * because @cypress/webpack-dev-server references cypress types */
import { describe, expect, it } from '@jest/globals';

jest.mock('@cypress/webpack-dev-server');
jest.mock('@ngtools/webpack');

const mockStartDevServer = startDevServer as jest.MockedFunction<
  typeof startDevServer
>;
const mockAngularCompilerPlugin = AngularCompilerPlugin as jest.MockedClass<
  typeof AngularCompilerPlugin
>;

describe(startAngularDevServer.name, () => {
  describe('with default config', () => {
    beforeEach(() => {
      mockStartDevServer.mockResolvedValue({
        port: 4200,
        close: jest.fn(),
      });
    });

    afterEach(() => {
      mockStartDevServer.mockReset();
      mockAngularCompilerPlugin.mockReset();
    });

    xit(`should call startDevServer with the right webpack options`, async () => {
      const resolvedConfig = await startAngularDevServer({
        config: {} as Cypress.PluginConfigOptions,
        options: {} as Cypress.DevServerOptions,
      });

      expect(resolvedConfig).toEqual(
        expect.objectContaining({
          port: 4300,
        })
      );

      expect(startDevServer).toBeCalledTimes(1);
      expect(startDevServer).toBeCalledWith({
        webpackConfig: {
          devtool: false,
          plugins: [expect.any(AngularCompilerPlugin)],
          resolve: {
            extensions: ['.js', '.ts'],
          },
          module: {
            rules: [
              {
                test: /\.ts$/,
                loader: '@ngtools/webpack',
              },
              {
                test: /\.css$/,
                loader: 'raw-loader',
              },
              {
                test: /\.scss$/,
                use: ['raw-loader', 'sass-loader'],
              },
            ],
          },
        },
      });
    });

    xit('should create angular compiler with the right options', async () => {
      // expect(mockAngularCompilerPlugin).toBeCalledTimes(1);
      // expect(mockAngularCompilerPlugin).toBeCalledWith({
      //   directTemplateLoading: true,
      //   forkTypeChecker: true,
      //   sourceMap: false,
      //   tsConfigPath: '/packages/lib-e2e/tsconfig.e2e.json',
      // });
    });
  });

  describe('with custom webpack config', () => {
    it.todo('should merge with resolved webpack config');
  });
});
