import {
  addDependenciesToPackageJson,
  installPackagesTask,
  convertNxGenerator,
  Tree,
} from '@nrwl/devkit';

export async function ngAddGenerator(tree: Tree) {
  addDependenciesToPackageJson(
    tree,
    {},
    {
      cypress: '^8.1.0',
      '@nrwl/cypress': '^12.3.5'
    }
  );
  return () => installPackagesTask(tree);
}

export default ngAddGenerator;

export const ngAddSchematic = convertNxGenerator(ngAddGenerator);
