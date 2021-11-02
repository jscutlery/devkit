import { targetFromTargetString } from '@angular-devkit/architect';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';

import type { PathLike } from 'fs';

export function findTargetOptions(
  dir: string,
  target: string
): Record<string, unknown> | undefined {
  const workspaceDefPath = _findWorkspaceDefPath(dir);

  if (workspaceDefPath == null) {
    throw new Error(
      'Cannot find workspace definition to load "target" options from'
    );
  }

  const workspaceDef = JSON.parse(
    readFileSync(workspaceDefPath, {
      encoding: 'utf-8',
    })
  ) as Record<string, unknown>;

  const {
    project,
    target: targetString,
    configuration,
  } = targetFromTargetString(target);

  return _findOptions({
    root: dirname(workspaceDefPath),
    workspaceDef,
    project,
    target: targetString,
    configuration,
  });
}

function _findOptions({
  root,
  workspaceDef,
  project,
  target,
  configuration,
}: {
  root: string;
  workspaceDef: Record<string, unknown>;
  project: string;
  target: string;
  configuration?: string;
}): Record<string, unknown> | undefined {
  /* Standalone project configuration case: */
  if (typeof workspaceDef?.projects?.[project] === 'string') {
    const standaloneDef = JSON.parse(
      readFileSync(
        resolve(root, `${workspaceDef.projects[project]}/project.json`),
        {
          encoding: 'utf-8',
        }
      )
    );

    if (configuration) {
      return standaloneDef.targets[target]?.configurations[configuration];
    }

    return standaloneDef.targets?.[target]?.options;
  }

  return _findOptionsFromNgOrNx({
    workspaceDef,
    project,
    target,
    configuration,
  });
}

function _findOptionsFromNgOrNx({
  workspaceDef,
  project,
  target,
  configuration,
}: {
  workspaceDef: Record<string, unknown>;
  project: string;
  target: string;
  configuration?: string;
}): Record<string, unknown> | undefined {
  const projectDef: Record<string, unknown> = workspaceDef?.projects?.[project];

  if (projectDef == undefined) {
    return undefined;
  }

  let targetDef: Record<string, unknown>;

  if (workspaceDef?.projects?.[project]?.targets?.[target]) {
    targetDef = projectDef.targets[target];
  }

  if (workspaceDef?.projects?.[project]?.architect?.[target]) {
    targetDef = projectDef.architect[target];
  }

  if (configuration) {
    return targetDef.configurations?.[configuration];
  }

  if (targetDef?.options) {
    return targetDef.options as Record<string, unknown>;
  }

  return undefined;
}

function _findWorkspaceDefPath(
  dir: PathLike,
  maxRecursion = 5
): string | undefined {
  const currentDir = dir.toString();

  if (existsSync(resolve(currentDir, 'workspace.json'))) {
    return resolve(currentDir, 'workspace.json');
  }

  if (existsSync(resolve(currentDir, 'angular.json'))) {
    return resolve(currentDir, 'angular.json');
  }

  if (maxRecursion === 0) {
    return undefined;
  }

  const parentDir = resolve(currentDir, '../');
  for (const dirent of readdirSync(parentDir, {
    withFileTypes: true,
  })) {
    if (dirent.isDirectory()) {
      return _findWorkspaceDefPath(parentDir, maxRecursion - 1);
    }
  }
}
