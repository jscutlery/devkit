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
      '@jscutlery/cypress-mount': '^0.9.1',
      cypress: '^7.0.0',
    }
  );
  return () => installPackagesTask(tree);
}

export default ngAddGenerator;

export const ngAddSchematic = convertNxGenerator(ngAddGenerator);
