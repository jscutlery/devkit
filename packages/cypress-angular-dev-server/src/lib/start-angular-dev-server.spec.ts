import { startAngularDevServer } from './start-angular-dev-server';

import {
  ResolvedDevServerConfig,
  startDevServer,
} from '@cypress/webpack-dev-server';
import { AngularWebpackPlugin } from '@ngtools/webpack';

/* Import jest functions manually as they conflict with cypress
 * because @cypress/webpack-dev-server references cypress types */
import { describe, expect, it } from '@jest/globals';

jest.mock('@cypress/webpack-dev-server');
jest.mock('@ngtools/webpack');

const mockStartDevServer = startDevServer as jest.MockedFunction<
  typeof startDevServer
>;
const mockAngularCompilerPlugin = AngularWebpackPlugin as jest.MockedClass<
  typeof AngularWebpackPlugin
>;

describe(startAngularDevServer.name, () => {
  describe('with default config', () => {
    let resolvedConfig: ResolvedDevServerConfig;

    beforeEach(() => {
      mockStartDevServer.mockResolvedValue({
        port: 4300,
        close: jest.fn(),
      });
    });

    /**
     * 🎬 Action!
     */
    beforeEach(async () => {
      resolvedConfig = await startAngularDevServer({
        config: {} as Cypress.PluginConfigOptions,
        options: {
          specs: [],
          config: {
            configFile: '/root/packages/a/cypress.json',
            version: '7.1.0',
            testingType: 'component',
          } as Partial<Cypress.ResolvedConfigOptions>,
        } as Cypress.DevServerOptions,
      });
    });

    afterEach(() => {
      mockStartDevServer.mockReset();
      mockAngularCompilerPlugin.mockReset();
    });

    it(`should call startDevServer with the right webpack options`, async () => {
      expect(resolvedConfig).toEqual(
        expect.objectContaining({
          port: 4300,
        })
      );

      expect(startDevServer).toBeCalledTimes(1);
      expect(startDevServer).toBeCalledWith({
        options: expect.objectContaining({
          specs: [],
          config: {
            configFile: '/root/packages/a/cypress.json',
            version: '7.1.0',
            testingType: 'component',
          },
        }),
        webpackConfig: {
          devtool: false,
          plugins: [expect.any(AngularWebpackPlugin)],
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

    it('should create angular compiler with the right options', async () => {
      expect(mockAngularCompilerPlugin).toBeCalledTimes(1);
      expect(mockAngularCompilerPlugin).toBeCalledWith({
        directTemplateLoading: true,
        /* Use `tsconfig.json` as default tsconfig path. */
        tsconfig: 'tsconfig.json',
      });
    });
  });

  describe('with custom webpack config', () => {
    it.todo('should merge with resolved webpack config');
  });

  describe('with custom tsConfig path', () => {
    it.todo('should forward tsConfig path to AngularCompilerPlugin');
  });
});
