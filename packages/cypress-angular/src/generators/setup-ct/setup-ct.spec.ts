import { addProjectConfiguration, readJson, Tree, writeJson } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { SetupCtGeneratorSchema } from './schema';
import { setupCtGenerator } from './setup-ct';

describe('setup-ct generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace(2);
  });

  describe('Target build options', () => {
    it('configure startAngularDevServer with specified --target', async () => {
      await setupLib({ target: 'my-app:build:production' });
      expect(readFile('libs/my-lib/cypress/plugins/index.ts')).toContain(
        `startAngularDevServer({ options, tsConfig: 'tsconfig.cypress.json', target: 'my-app:build:production' })`
      );
    });
  });

  describe('Component Testing configuration', () => {
    beforeEach(async () => await setupLib());

    it('should add libs/my-lib/cypress/plugins/index.ts and configure startAngularDevServer', async () => {
      const cypressPluginPath = 'libs/my-lib/cypress/plugins/index.ts';
      expect(tree.exists(cypressPluginPath)).toBeTruthy();
      expect(readFile(cypressPluginPath)).toContain(
        `startAngularDevServer({ options, tsConfig: 'tsconfig.cypress.json', target: 'my-lib:build' })`
      );
    });

    it('should add libs/my-lib/cypress/support/index.ts', () => {
      const cypressSupportPath = 'libs/my-lib/cypress/support/index.ts';
      expect(tree.exists(cypressSupportPath)).toBeTruthy();
      expect(readFile(cypressSupportPath)).toContain(
        `import '@jscutlery/cypress-angular/support';`
      );
    });

    it('should add tsconfig.cypress.json to tsconfig.json references', () => {
      expect(readJson(tree, 'libs/my-lib/tsconfig.json')).toEqual(
        expect.objectContaining({
          references: [
            {
              path: './tsconfig.cypress.json',
            },
          ],
        })
      );
    });

    it('should add libs/my-lib/cypress.json', () => {
      const cypressConfigPath = 'libs/my-lib/cypress.json';
      expect(tree.exists(cypressConfigPath)).toBeTruthy();
      expect(readJson(tree, cypressConfigPath)).toEqual(
        expect.objectContaining({
          pluginsFile: './cypress/plugins/index.ts',
          supportFile: './cypress/support/index.ts',
          component: {
            testFiles: '**/*.cy-spec.{js,ts,jsx,tsx}',
            componentFolder: './src',
          },
        })
      );
    });

    it('should add libs/my-lib/tsconfig.cypress.json', () => {
      const tsconfigPath = 'libs/my-lib/tsconfig.cypress.json';
      expect(tree.exists(tsconfigPath)).toBeTruthy();
      expect(readJson(tree, tsconfigPath)).toEqual(
        expect.objectContaining({
          extends: '../../tsconfig.base.json',
          compilerOptions: {
            allowSyntheticDefaultImports: true,
            types: ['cypress'],
          },
          include: ['cypress/support/**/*.ts', '**/*.cy-spec.ts'],
        })
      );
    });

    it('should add "ct" executor', () => {
      expect(
        readJson(tree, 'workspace.json').projects['my-lib'].targets.ct
      ).toEqual(
        expect.objectContaining({
          executor: '@nrwl/cypress:cypress',
          options: {
            cypressConfig: 'libs/my-lib/cypress.json',
            testingType: 'component',
            tsConfig: 'libs/my-lib/tsconfig.cypress.json',
          },
        })
      );
    });
  });

  describe('Workspace definition version 1', () => {
    beforeEach(async () => {
      tree = createTreeWithEmptyWorkspace(1);
      await setupLib();
    });

    it('should support old workspace definition', () => {
      expect(
        readJson(tree, 'workspace.json').projects['my-lib'].architect.ct
      ).toEqual(
        expect.objectContaining({
          builder: '@nrwl/cypress:cypress',
          options: {
            cypressConfig: 'libs/my-lib/cypress.json',
            testingType: 'component',
            tsConfig: 'libs/my-lib/tsconfig.cypress.json',
          },
        })
      );
    });
  });

  async function setupLib({ target }: { target?: string } = {}) {
    addProjectConfiguration(tree, 'my-lib', {
      root: 'libs/my-lib',
      targets: {},
    });

    writeJson(tree, 'libs/my-lib/tsconfig.json', {});

    await setupCtGenerator(tree, {
      project: 'my-lib',
      target,
    } as SetupCtGeneratorSchema);
  }

  function readFile(path: string) {
    return tree.read(path).toString('utf-8');
  }
});
