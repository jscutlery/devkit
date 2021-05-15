import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import generator from './generator';
import { SetupCtGeneratorSchema } from './schema';

describe('setup-ct generator', () => {
  let appTree: Tree;
  const options: SetupCtGeneratorSchema = { project: 'my-lib' };

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
    await generator(appTree, options);
  });

  it.todo('should add libs/my-lib/cypress/plugins/index.ts');

  it.todo('should add libs/my-lib/cypress.json');
});
