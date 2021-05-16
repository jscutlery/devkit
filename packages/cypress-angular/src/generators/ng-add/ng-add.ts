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
      cypress: '^7.0.0',
    }
  );
  return () => installPackagesTask(tree);
}

export default ngAddGenerator;

export const ngAddSchematic = convertNxGenerator(ngAddGenerator);
