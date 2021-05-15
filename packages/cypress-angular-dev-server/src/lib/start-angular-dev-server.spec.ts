import { AngularWebpackPlugin } from '@ngtools/webpack';
import {
  ResolvedDevServerConfig,
  startDevServer,
} from '@cypress/webpack-dev-server';
/* Import jest functions manually as they conflict with cypress
 * because @cypress/webpack-dev-server references cypress types */
import { describe, expect, it } from '@jest/globals';
import { resolve } from 'path';
import { startAngularDevServer } from './start-angular-dev-server';

jest.mock('@cypress/webpack-dev-server');

const mockStartDevServer = startDevServer as jest.MockedFunction<
  typeof startDevServer
>;

describe(startAngularDevServer.name, () => {
  const testProjectPath = resolve(__dirname, '__tests__/fixtures/demo');

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
        config: {
          projectRoot: testProjectPath,
          componentFolder: testProjectPath,
        } as Cypress.RuntimeConfigOptions,
        options: {
          specs: [],
          config: {
            configFile: resolve(testProjectPath, 'cypress.json'),
            version: '7.1.0',
            testingType: 'component',
          } as Partial<Cypress.ResolvedConfigOptions>,
        } as Cypress.DevServerOptions,
      });
    });

    afterEach(() => {
      mockStartDevServer.mockReset();
    });

    it(`should return the startDevServer resolved config`, () => {
      expect(resolvedConfig).toEqual(
        expect.objectContaining({
          port: 4300,
        })
      );
    });

    it(`should call startDevServer with the right options and webpack config`, async () => {
      expect(startDevServer).toBeCalledTimes(1);
      const { options, webpackConfig } = mockStartDevServer.mock.calls[0][0];
      expect(options).toEqual(
        expect.objectContaining({
          specs: [],
          config: {
            configFile: expect.stringMatching(
              /__tests__\/fixtures\/demo\/cypress.json$/
            ),
            version: '7.1.0',
            testingType: 'component',
          },
        })
      );
      /* Make sure Angular plugin is loaded. */
      expect(webpackConfig.plugins).toEqual(
        expect.arrayContaining([expect.any(AngularWebpackPlugin)])
      );
      /* Check config has rules. */
      expect(webpackConfig.module.rules.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('with custom webpack config', () => {
    it.todo('should merge with resolved webpack config');
  });

  describe('with custom tsConfig path', () => {
    it.todo('should forward tsConfig path to AngularCompilerPlugin');
  });
});
