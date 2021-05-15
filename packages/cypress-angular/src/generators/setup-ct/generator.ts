import { formatFiles, Tree } from '@nrwl/devkit';
import { SetupCtGeneratorSchema } from './schema';

interface NormalizedSchema {
  projectName: string;
}

function normalizeOptions(
  host: Tree,
  options: SetupCtGeneratorSchema
): NormalizedSchema {
  return {
    projectName: options.project,
  };
}

export default async function (host: Tree, options: SetupCtGeneratorSchema) {
  const normalizedOptions = normalizeOptions(host, options);
  await formatFiles(host);
}
