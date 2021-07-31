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

  beforeEach(() => {
    mockStartDevServer.mockResolvedValue({
      port: 4300,
      close: jest.fn(),
    });
  });

  afterEach(() => {
    mockStartDevServer.mockReset();
  });

  describe('with default config', () => {
    let resolvedConfig: ResolvedDevServerConfig;

    /**
     * 🎬 Action!
     */
    beforeEach(async () => {
      resolvedConfig = await startAngularDevServer({
        options: {
          specs: [],
          config: {
            componentFolder: resolve(testProjectPath, 'src'),
            configFile: resolve(testProjectPath, 'cypress.json'),
            projectRoot: testProjectPath,
            version: '7.1.0',
            testingType: 'component',
          } as Partial<
            Cypress.ResolvedConfigOptions & Cypress.RuntimeConfigOptions
          >,
        } as Cypress.DevServerOptions,
      });
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
          config: expect.objectContaining({
            configFile: expect.stringMatching(
              /__tests__\/fixtures\/demo\/cypress.json$/
            ),
            version: '7.1.0',
            testingType: 'component',
          }),
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
    /**
     * 🎬 Action!
     */
    beforeEach(async () => {
      await startAngularDevServer({
        options: {
          specs: [],
          config: {
            componentFolder: resolve(testProjectPath, 'src'),
            configFile: resolve(testProjectPath, 'cypress.json'),
            projectRoot: testProjectPath,
            version: '7.1.0',
            testingType: 'component',
          } as Partial<
            Cypress.ResolvedConfigOptions & Cypress.RuntimeConfigOptions
          >,
        } as Cypress.DevServerOptions,
        webpackConfig: {
          node: {
            global: true,
          }
        }
      });
    });

    it('should merge with resolved webpack config', () => {
      const { webpackConfig } = mockStartDevServer.mock.calls[0][0];

      expect(webpackConfig.node).toEqual({ global: true });
    });
  });

  describe('with custom tsConfig path', () => {
    /**
     * 🎬 Action!
     */
    beforeEach(async () => {
      await startAngularDevServer({
        options: {
          specs: [],
          config: {
            componentFolder: resolve(testProjectPath, 'src'),
            configFile: resolve(testProjectPath, 'cypress.json'),
            projectRoot: testProjectPath,
            version: '7.1.0',
            testingType: 'component',
          } as Partial<
            Cypress.ResolvedConfigOptions & Cypress.RuntimeConfigOptions
          >,
        } as Cypress.DevServerOptions,
        tsConfig: 'tsconfig.cypress.json',
      });
    });

    it('should forward tsConfig path to AngularWebpackPlugin', () => {
      expect(startDevServer).toBeCalledTimes(1);
      const { webpackConfig } = mockStartDevServer.mock.calls[0][0];

      const plugin = webpackConfig.plugins.find(
        (plugin) => plugin instanceof AngularWebpackPlugin
      );

      expect(plugin.options.tsconfig).toMatch(
        /__tests__\/fixtures\/demo\/tsconfig.cypress.json$/
      );
    });
  });
});
