import { parseTargetString } from '@nrwl/devkit';
import { existsSync } from 'fs';
import { readdir, readFile } from 'fs/promises';
import { resolve } from 'path';

import type { PathLike } from 'fs';

export async function findTargetOptions(
  dir: string,
  target: string
): Promise<Record<string, unknown> | undefined> {
  const workspaceDefPath = await findWorkspaceDefinition(dir);

  if (workspaceDefPath == null) {
    throw new Error(
      'Cannot find workspace definition to load "target" options from'
    );
  }

  const content = await readFile(workspaceDefPath, {
    encoding: 'utf-8',
  });
  const workspaceDef = JSON.parse(content);

  const {
    project,
    target: targetString,
    configuration,
  } = parseTargetString(target);

  /* @todo: handle Angular CLI format */

  if (configuration) {
    return workspaceDef?.projects?.[project]?.targets?.[targetString]
      ?.configurations?.[configuration];
  }

  return workspaceDef?.projects?.[project]?.targets?.[targetString]?.options;
}

async function findWorkspaceDefinition(
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
      await findWorkspaceDefinition(dirent.name, recurseCount);
    }
  }
}
