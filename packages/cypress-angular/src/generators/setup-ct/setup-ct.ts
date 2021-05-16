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

/**
 * Generate cypress.json + cypress/plugins/index.ts + src/sample.cy-spec.ts
 */
function _addCypressFiles(
  tree: Tree,
  { projectRoot }: { projectRoot: string }
) {
  generateFiles(tree, join(__dirname, './files'), projectRoot, { tmpl: '' });
}

/**
 * Create or update `tsconfig.cypress.json` with the right options
 * like `cypress` types and including `*.cy-spec.ts`.
 */
function _updateCypressTsconfig(
  tree: Tree,
  { projectRoot }: { projectRoot: string }
) {
  const defaultBaseTsconfigPath = 'tsconfig.base.json';
  const baseTsconfigPath = tree.exists(defaultBaseTsconfigPath)
    ? defaultBaseTsconfigPath
    : 'tsconfig.json';
  const cypressTsConfigName = 'tsconfig.cypress.json';

  /* Compute base tsconfig relative path. */
  const relativeBaseTsconfig = join(
    offsetFromRoot(projectRoot),
    baseTsconfigPath
  );

  const cypressTsConfig = join(projectRoot, cypressTsConfigName);

  /* Make sure file exists first. */
  if (!tree.exists(cypressTsConfig)) {
    writeJson(tree, cypressTsConfig, {});
  }

  /* Fill or update. */
  updateJson(tree, cypressTsConfig, (json) => ({
    ...json,
    extends: relativeBaseTsconfig,
    compilerOptions: {
      ...json?.compilerOptions,
      types: ['cypress'],
    },
    include: ['**/*.cy-spec.ts'],
  }));

  /* Create or update tsconfig.json with references if it exists. */
  const projectTsConfig = join(projectRoot, 'tsconfig.json');
  if (tree.exists(projectTsConfig)) {
    updateJson(tree, projectTsConfig, (json) => {
      const referencePath = `./${cypressTsConfigName}`;

      /* Ignore reference if alread added to avoid adding it twice. */
      const references = (json.references ?? []).filter(
        (path) => path !== referencePath
      );

      /* Add reference to cypress tsconfig. */
      return {
        ...json,
        references: [
          ...references,
          {
            path: referencePath,
          },
        ],
      };
    });
  }
}
