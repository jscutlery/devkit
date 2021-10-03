import { parseTargetString } from '@nrwl/devkit';
import { existsSync } from 'fs';
import { readdir, readFile } from 'fs/promises';
import { resolve, dirname } from 'path';

import type { PathLike } from 'fs';

export async function findTargetOptions(
  dir: string,
  target: string
): Promise<Record<string, unknown> | undefined> {
  const workspaceDefPath = await _findWorkspaceDefinition(dir);

  if (workspaceDefPath == null) {
    throw new Error(
      'Cannot find workspace definition to load "target" options from'
    );
  }

  const workspaceDef = JSON.parse(
    await readFile(workspaceDefPath, {
      encoding: 'utf-8',
    })
  ) as Record<string, unknown>;

  const {
    project,
    target: targetString,
    configuration,
  } = parseTargetString(target);

  return _findOptions({
    root: dirname(workspaceDefPath),
    workspaceDef,
    project,
    target: targetString,
    configuration,
  });
}

async function _findOptions({
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
}): Promise<Record<string, unknown> | undefined> {
  /* Standalone project configuration case: */
  if (typeof workspaceDef?.projects?.[project] === 'string') {
    const standaloneDef = JSON.parse(
      await readFile(resolve(root, workspaceDef.projects[project]), {
        encoding: 'utf-8',
      })
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

async function _findWorkspaceDefinition(
  dir: PathLike,
  recurseCount = 3
): Promise<string | undefined> {
  const currentDir = dir.toString();

  if (existsSync(resolve(currentDir, 'workspace.json'))) {
    return resolve(currentDir, 'workspace.json');
  }

  if (existsSync(resolve(currentDir, 'angular.json'))) {
    return resolve(currentDir, 'angular.json');
  }

  if (recurseCount === 0) {
    return;
  }

  for (const dirent of await readdir(resolve('../', currentDir), {
    withFileTypes: true,
  })) {
    if (dirent.isDirectory()) {
      --recurseCount;
      await _findWorkspaceDefinition(dirent.name, recurseCount);
    }
  }
}
