import {
  convertNxGenerator,
  formatFiles,
  generateFiles,
  getWorkspacePath,
  offsetFromRoot,
  ProjectConfiguration,
  Tree,
  updateJson,
  WorkspaceJsonConfiguration,
  writeJson,
} from '@nrwl/devkit';
import { join } from 'path';
import { SetupCtGeneratorSchema } from './schema';

export async function setupCtGenerator(
  tree: Tree,
  options: SetupCtGeneratorSchema
) {
  const { projectRoot } = _normalizeOptions(tree, options);

  _addCypressFiles(tree, {
    projectRoot,
  });

  _updateCypressTsconfig(tree, { projectRoot });

  await formatFiles(tree);
}

export default setupCtGenerator;

export const setupCtSchematic = convertNxGenerator(setupCtGenerator);

interface NormalizedSchema {
  projectName: string;
  projectRoot: string;
}

function _normalizeOptions(
  tree: Tree,
  options: SetupCtGeneratorSchema
): NormalizedSchema {
  const projectName = options.project;
  const project = _readProjectConfiguration(tree, projectName);

  return {
    projectName: options.project,
    projectRoot: project.root,
  };
}

/**
 * @hack using custom version of @nrwl/devkit's `readProjectConfiguration`
 * because `readProjectConfiguration` is not compatible with Angular CLI project
 * as nx.json is missing.
 * Cf. https://github.com/nrwl/nx/issues/5678
 */
function _readProjectConfiguration(
  tree: Tree,
  projectName: string
): ProjectConfiguration {
  const workspace: WorkspaceJsonConfiguration = JSON.parse(
    tree.read(getWorkspacePath(tree)).toString('utf-8')
  );
  const project = workspace.projects[projectName];

  if (project == null) {
    throw new Error(`Project "${projectName}" not found.`);
  }

  return project;
}

function _addCypressFiles(
  tree: Tree,
  { projectRoot }: { projectRoot: string }
) {
  generateFiles(tree, join(__dirname, './files'), projectRoot, { tmpl: '' });
}

function _updateCypressTsconfig(
  tree: Tree,
  { projectRoot }: { projectRoot: string }
) {
  const defaultBaseTsconfigPath = 'tsconfig.base.json';
  const baseTsconfigPath = tree.exists(defaultBaseTsconfigPath)
    ? defaultBaseTsconfigPath
    : 'tsconfig.json';

  /* Compute base tsconfig relative path. */
  const relativeBaseTsconfigPath = join(
    offsetFromRoot(projectRoot),
    baseTsconfigPath
  );

  const tsconfigPath = join(projectRoot, 'tsconfig.cypress.json');

  /* Make sure file exists first. */
  if (!tree.exists(tsconfigPath)) {
    writeJson(tree, tsconfigPath, {});
  }

  /* Fill or update. */
  updateJson(tree, tsconfigPath, (json) => ({
    ...json,
    extends: relativeBaseTsconfigPath,
    compilerOptions: {
      ...json?.compilerOptions,
      types: ['cypress'],
    },
    include: ['**/*.cy-spec.ts'],
  }));
}
