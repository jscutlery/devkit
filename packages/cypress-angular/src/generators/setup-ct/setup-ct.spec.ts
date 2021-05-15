import { addProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { SetupCtGeneratorSchema } from './schema';
import { setupCtGenerator } from './setup-ct';

describe('setup-ct generator', () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();

    addProjectConfiguration(tree, 'my-lib', {
      root: 'libs/my-lib',
      targets: {},
    });

    await setupCtGenerator(tree, {
      project: 'my-lib',
    } as SetupCtGeneratorSchema);
  });

  it('should add libs/my-lib/cypress/plugins/index.ts', () => {
    const cypressPluginPath = 'libs/my-lib/cypress/plugins/index.ts';
    expect(tree.exists(cypressPluginPath)).toBeTruthy();
    expect(readFile(cypressPluginPath)).toContain(
      `startAngularDevServer({ config, options })`
    );
  });

  it('should pass tsconfig.cypress.json path to startAngularDevServer', () => {
    expect(readFile('libs/my-lib/cypress/plugins/index.ts')).toContain(
      `startAngularDevServer({ config, options })`
    );
  });

  it('should add libs/my-lib/cypress.json', () => {
    const cypressConfigPath = 'libs/my-lib/cypress.json';
    expect(tree.exists(cypressConfigPath)).toBeTruthy();
    expect(readJson(cypressConfigPath)).toEqual(
      expect.objectContaining({
        pluginsFile: './cypress/plugins/index.ts',
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
    expect(readJson(tsconfigPath)).toEqual(
      expect.objectContaining({
        extends: '../../tsconfig.base.json',
        compilerOptions: {
          types: ['cypress'],
        },
        include: ['**/*.cy-spec.ts'],
      })
    );
  });

  function readJson(path: string) {
    return JSON.parse(readFile(path));
  }

  function readFile(path: string) {
    return tree.read(path).toString('utf-8');
  }
});
