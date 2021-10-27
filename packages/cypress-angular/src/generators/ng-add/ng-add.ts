import { addDependenciesToPackageJson, convertNxGenerator, installPackagesTask } from '@nrwl/devkit';

import type {  Tree } from '@nrwl/devkit';

export async function ngAddGenerator(tree: Tree) {
  addDependenciesToPackageJson(
    tree,
    {},
    {
      cypress: '^8.7.0',
      '@nrwl/cypress': '^12.9.0'
    }
  );
  return () => installPackagesTask(tree);
}

export default ngAddGenerator;

export const ngAddSchematic = convertNxGenerator(ngAddGenerator);
