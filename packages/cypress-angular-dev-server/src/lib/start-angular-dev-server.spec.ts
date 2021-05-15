import { ResolvedDevServerConfig, startDevServer } from '@cypress/webpack-dev-server';
/* Import jest functions manually as they conflict with cypress
 * because @cypress/webpack-dev-server references cypress types */
import { describe, expect, it } from '@jest/globals';

import { createAngularWebpackConfig } from './create-angular-webpack-config';
import { startAngularDevServer } from './start-angular-dev-server';

jest.mock('@cypress/webpack-dev-server');
jest.mock('./create-angular-webpack-config');

const mockStartDevServer = startDevServer as jest.MockedFunction<
  typeof startDevServer
>;

const mockCreateAngularWebpackConfig =
  createAngularWebpackConfig as jest.MockedFunction<
    typeof createAngularWebpackConfig
  >;

describe(startAngularDevServer.name, () => {
  describe('with default config', () => {
    let resolvedConfig: ResolvedDevServerConfig;

    beforeEach(() => {
      mockCreateAngularWebpackConfig.mockResolvedValue({});
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
        config: {
          projectRoot: '/root/packages/a',
          componentFolder: '/root/packages/a/src/components',
        } as Cypress.RuntimeConfigOptions,
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
      mockCreateAngularWebpackConfig.mockReset();
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
        webpackConfig: expect.any(Object),
      });
    });

    it('should call createAngularWebpackConfig with right options', async () => {
      expect(mockCreateAngularWebpackConfig).toBeCalledTimes(1);
      expect(mockCreateAngularWebpackConfig).toBeCalledWith({
        componentFolder: '/root/packages/a/src/components',
        projectRoot: '/root/packages/a',
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
