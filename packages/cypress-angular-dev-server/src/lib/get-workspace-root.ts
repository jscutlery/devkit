import { existsSync, readdirSync } from 'fs';
import { dirname, resolve } from 'path';
import type { PathLike } from 'fs';
import { getWorkspaceFilePath } from './get-worksspace-file-path';

export const getWorkspaceRoot = (projectDirectory: string): string => {
  const workspaceDefPath = findWorkspaceDefPath(projectDirectory);
  if (!workspaceDefPath) {
    throw new Error(
      'Cannot find workspace definition to load "target" options from'
    );
  }
  return dirname(workspaceDefPath);
};

const findWorkspaceDefPath = (
  dir: PathLike,
  maxRecursion = 10
): string | undefined => {
  const currentDir = dir.toString();
  const workspaceFilePath = getWorkspaceFilePath(currentDir);
  if (workspaceFilePath) {
    return workspaceFilePath;
  }

  if (maxRecursion === 0) {
    return undefined;
  }

  const parentDir = resolve(currentDir, '../');
  if (!existsSync(parentDir)) {
    return undefined;
  }

  for (const dirent of readdirSync(parentDir, {
    withFileTypes: true,
  })) {
    if (dirent.isDirectory()) {
      return findWorkspaceDefPath(parentDir, maxRecursion - 1);
    }
  }
};
