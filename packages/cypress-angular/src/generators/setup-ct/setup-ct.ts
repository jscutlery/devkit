import {
  convertNxGenerator,
  formatFiles,
  generateFiles,
  offsetFromRoot,
  readProjectConfiguration,
  updateJson,
  updateProjectConfiguration,
  writeJson,
} from '@nrwl/devkit';
import { join } from 'path';

import type { Tree } from '@nrwl/devkit';
import type { SetupCtGeneratorSchema } from './schema';

export async function setupCtGenerator(
  tree: Tree,
  options: SetupCtGeneratorSchema
) {
  const { projectRoot, projectName, target } = _normalizeOptions(tree, options);
  const cypressTsConfigName = 'tsconfig.cypress.json';
  const cypressTsConfig = join(projectRoot, cypressTsConfigName);

  _addCypressFiles(tree, {
    projectRoot,
    target,
  });

  _updateCypressTsconfig(tree, {
    projectRoot,
    cypressTsConfig,
    cypressTsConfigName,
  });

  _updateWorkspaceDefinition(tree, {
    projectName,
    projectRoot,
    cypressTsConfig,
  });

  await formatFiles(tree);
}

export default setupCtGenerator;

export const setupCtSchematic = convertNxGenerator(setupCtGenerator);

interface NormalizedSchema {
  projectName: string;
  projectRoot: string;
  target: string;
}

function _normalizeOptions(
  tree: Tree,
  options: SetupCtGeneratorSchema
): NormalizedSchema {
  const projectName = options.project;
  const project = readProjectConfiguration(tree, projectName);

  return {
    projectName: options.project,
    projectRoot: project.root,
    target: options.target ?? `${options.project}:build`,
  };
}

/**
 * Generate cypress.json + cypress/plugins/index.ts + src/sample.cy-spec.ts
 */
function _addCypressFiles(
  tree: Tree,
  { projectRoot, target }: { projectRoot: string; target: string }
) {
  generateFiles(tree, join(__dirname, './files'), projectRoot, {
    tmpl: '',
    target,
  });
}

/**
 * Create or update `tsconfig.cypress.json` with the right options
 * like `cypress` types and including `*.cy-spec.ts`.
 */
function _updateCypressTsconfig(
  tree: Tree,
  {
    projectRoot,
    cypressTsConfig,
    cypressTsConfigName,
  }: {
    projectRoot: string;
    cypressTsConfig: string;
    cypressTsConfigName: string;
  }
) {
  const defaultBaseTsconfigPath = 'tsconfig.base.json';
  let baseTsconfigPath: string;

  let hasRootTsconfig = true;
  if (tree.exists(defaultBaseTsconfigPath)) {
    baseTsconfigPath = defaultBaseTsconfigPath;
  } else if (tree.exists(projectRoot + '/tsconfig.app.json')) {
    baseTsconfigPath = './tsconfig.app.json';
    hasRootTsconfig = false;
  } else {
    baseTsconfigPath = 'tsconfig.json';
  }

  /* Compute base tsconfig relative path. */
  const relativeBaseTsconfig = hasRootTsconfig
    ? join(offsetFromRoot(projectRoot), baseTsconfigPath)
    : baseTsconfigPath;

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
      /* @hack this is needed because @jscutlery/cypress-mount
       * depends on Storybook which depends on React's default
       * export using "=". */
      allowSyntheticDefaultImports: true,
      types: ['cypress'],
    },
    include: ['cypress/support/**/*.ts', '**/*.cy-spec.ts'],
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

function _updateWorkspaceDefinition(
  tree: Tree,
  {
    projectName,
    projectRoot,
    cypressTsConfig,
  }: { projectName: string; projectRoot: string; cypressTsConfig: string }
): void {
  const projectConfiguration = readProjectConfiguration(tree, projectName);
  const cypressConfig = join(projectRoot, 'cypress.json');

  updateProjectConfiguration(tree, projectName, {
    ...projectConfiguration,
    targets: {
      ...projectConfiguration.targets,
      ct: {
        executor: '@nrwl/cypress:cypress',
        options: {
          cypressConfig,
          tsConfig: cypressTsConfig,
          testingType: 'component',
        },
      },
    },
  });
}
