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
    expect(tree.exists('libs/my-lib/cypress/plugins/index.ts')).toBeTruthy();
    expect(
      tree.read('libs/my-lib/cypress/plugins/index.ts').toString('utf-8')
    ).toContain(`startAngularDevServer({ config, options })`);
  });

  it('should add libs/my-lib/cypress.json', () => {
    expect(tree.exists('libs/my-lib/cypress.json')).toBeTruthy();
    expect(
      JSON.parse(tree.read('libs/my-lib/cypress.json').toString('utf-8'))
    ).toEqual(
      expect.objectContaining({
        pluginsFile: './cypress/plugins/index.ts',
        component: {
          testFiles: '**/*.cy-spec.{js,ts,jsx,tsx}',
          componentFolder: './src',
        },
      })
    );
  });
});
