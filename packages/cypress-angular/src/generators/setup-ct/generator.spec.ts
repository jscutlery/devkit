import { addProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import generator from './generator';
import { SetupCtGeneratorSchema } from './schema';

describe('setup-ct generator', () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
    addProjectConfiguration(tree, 'my-lib', {
      root: 'libs/my-lib',
      targets: {},
    });
    await generator(tree, {
      project: 'my-lib',
    } as SetupCtGeneratorSchema);
  });

  xit('should add libs/my-lib/cypress/plugins/index.ts', () => {
    expect(
      tree.read('libs/my-lib/cypress/plugins/index.ts').toString()
    ).toContain(`startAngularDevServer({ config, options })`);
  });

  xit('should add libs/my-lib/cypress.json', () => {
    expect(tree.read('libs/my-lib/cypress.json').toJSON()).toEqual(
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
