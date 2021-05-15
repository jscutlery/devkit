import {
  convertNxGenerator,
  formatFiles,
  generateFiles,
  getWorkspacePath,
  ProjectConfiguration,
  Tree,
  WorkspaceJsonConfiguration,
} from '@nrwl/devkit';
import { join } from 'path';
import { SetupCtGeneratorSchema } from './schema';

export async function setupCtGenerator(
  tree: Tree,
  options: SetupCtGeneratorSchema
) {
  const { projectRoot } = normalizeOptions(tree, options);
  addCypressFiles(tree, {
    projectRoot,
  });
  await formatFiles(tree);
}

export default setupCtGenerator;

export const setupCtSchematic = convertNxGenerator(setupCtGenerator);

interface NormalizedSchema {
  projectName: string;
  projectRoot: string;
}

function normalizeOptions(
  tree: Tree,
  options: SetupCtGeneratorSchema
): NormalizedSchema {
  const projectName = options.project;
  const project = readProjectConfiguration(tree, projectName);

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
function readProjectConfiguration(
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

function addCypressFiles(tree: Tree, { projectRoot }: { projectRoot: string }) {
  generateFiles(tree, join(__dirname, './files'), projectRoot, { tmpl: '' });
}
