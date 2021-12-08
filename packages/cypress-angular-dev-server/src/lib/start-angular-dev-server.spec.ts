import { loadEsmModule } from '@angular-devkit/build-angular/src/utils/load-esm';
import { readTsconfig } from '@angular-devkit/build-angular/src/utils/read-tsconfig';
import type { ParsedConfiguration } from '@angular/compiler-cli';
import {
  ResolvedDevServerConfig,
  startDevServer,
} from '@cypress/webpack-dev-server';
import { describe, expect, it } from '@jest/globals';
import { AngularWebpackPlugin } from '@ngtools/webpack';
import { normalize, resolve } from 'path';
import { URL } from 'url';
import { findTargetOptions } from './find-target-options';
import { startAngularDevServer } from './start-angular-dev-server';

jest.mock('@cypress/webpack-dev-server');
jest.mock('@angular-devkit/build-angular/src/utils/read-tsconfig');
jest.mock('@angular-devkit/build-angular/src/utils/load-esm');
jest.mock('./find-target-options');

const mockLoadEsmModule = loadEsmModule as jest.MockedFunction<
  typeof loadEsmModule
>;

const mockReadTsconfig = readTsconfig as jest.MockedFunction<
  typeof readTsconfig
>;

const mockStartDevServer = startDevServer as jest.MockedFunction<
  typeof startDevServer
>;

describe(startAngularDevServer.name, () => {
  const testProjectPath = resolve(__dirname, '__tests__/fixtures/demo');

  beforeEach(async () => {
    /* @hack mock loadEsmModule and throw an error because it is
     * imcompatible with jest and freezes the test.
     * Let's mock parent functions. */
    mockLoadEsmModule.mockImplementation(async (path) => {
      const modules = new Map<string | URL, unknown>([
        ['@angular/compiler-cli', await import('@angular/compiler-cli')],
      ]);
      const module = modules.get(path);
      if (module === undefined) {
        throw new Error(`mockLoadEsmModule can't locate module: ${path}`);
      }
      return module;
    });

    /* @hack mock readTsConfig because it calls loadEsmModule which
     * lazily imports @angular/compiler-cli using loadEsmModule
     * which is not compatible with jest and freezes the test. */
    mockReadTsconfig.mockResolvedValue({
      options: {},
    } as ParsedConfiguration);

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
            version: '9.1.0',
          } as Cypress.ResolvedConfigOptions & Cypress.RuntimeConfigOptions,
        } as Cypress.DevServerConfig,
      });
    });

    it(`should return the startDevServer resolved config`, () => {
      expect(resolvedConfig).toEqual(
        expect.objectContaining({
          port: 4300,
        })
      );

      expect(mockReadTsconfig).toBeCalledTimes(1);
      expect(mockReadTsconfig).toBeCalledWith(
        expect.stringContaining(
          normalize('__tests__/fixtures/demo/tsconfig.json')
        )
      );
    });

    it(`should call startDevServer with the right options and webpack config`, async () => {
      expect(startDevServer).toBeCalledTimes(1);
      const { options, webpackConfig } = mockStartDevServer.mock.calls[0][0];
      expect(options).toEqual(
        expect.objectContaining({
          specs: [],
          config: expect.objectContaining({
            configFile: expect.stringContaining(
              normalize('__tests__/fixtures/demo/cypress.json')
            ),
            version: '9.1.0',
          }),
        })
      );
      /* Make sure Angular plugin is loaded. */
      expect((webpackConfig as any).plugins).toEqual(
        expect.arrayContaining([expect.any(AngularWebpackPlugin)])
      );
      /* Check config has rules. */
      expect((webpackConfig as any).module.rules.length).toBeGreaterThanOrEqual(
        1
      );
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
            version: '9.1.0',
          } as Cypress.ResolvedConfigOptions & Cypress.RuntimeConfigOptions,
        } as Cypress.DevServerConfig,
        webpackConfig: {
          node: {
            global: true,
          },
        },
      });
    });

    it('should merge with resolved webpack config', () => {
      const { webpackConfig } = mockStartDevServer.mock.calls[0][0];

      expect((webpackConfig as any).node).toEqual({ global: true });
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
            version: '9.1.0',
          } as Cypress.ResolvedConfigOptions & Cypress.RuntimeConfigOptions,
        } as Cypress.DevServerConfig,
        tsConfig: 'tsconfig.cypress.json',
      });
    });

    it('should forward tsConfig path to AngularWebpackPlugin', () => {
      expect(startDevServer).toBeCalledTimes(1);
      const { webpackConfig } = mockStartDevServer.mock.calls[0][0];

      const plugin = (webpackConfig as any).plugins.find(
        (plugin) => plugin instanceof AngularWebpackPlugin
      );

      expect(plugin.options.tsconfig).toMatch(
        normalize('__tests__/fixtures/demo/tsconfig.cypress.json')
      );
    });
  });

  it('should create server with build target options', async () => {
    (findTargetOptions as jest.Mock).mockReturnValue({
      outputPath: 'dist/__test__',
      index: resolve(testProjectPath, 'index.html'),
      main: resolve(testProjectPath, 'src/main.ts'),
      polyfills: resolve(testProjectPath, 'polyfills.ts'),
      assets: [resolve(testProjectPath, 'src/assets')],
      styles: [resolve(testProjectPath, 'main.scss')],
    });

    await startAngularDevServer({
      target: 'test:build',
      options: {
        specs: [],
        config: {
          componentFolder: resolve(testProjectPath, 'src'),
          configFile: resolve(testProjectPath, 'cypress.json'),
          projectRoot: testProjectPath,
          version: '9.1.0',
        } as Cypress.ResolvedConfigOptions & Cypress.RuntimeConfigOptions,
      } as Cypress.DevServerConfig,
    });

    const { webpackConfig } = mockStartDevServer.mock.calls[0][0];

    expect((webpackConfig as any).entry.main).toEqual([
      resolve(testProjectPath, 'src/main.ts'),
    ]);
    expect((webpackConfig as any).entry.polyfills).toEqual(
      expect.arrayContaining([resolve(testProjectPath, 'polyfills.ts')])
    );
  });

  it.todo('should catch Angular CLI errors (such as empty polyfills)');
});
