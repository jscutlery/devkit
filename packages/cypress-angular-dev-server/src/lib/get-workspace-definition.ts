import { existsSync, readdirSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import type { PathLike } from 'fs';
import { TargetDefinition } from '@angular-devkit/core/src/workspace';

export interface ProjectDefinition {
  targets?: Record<string, TargetDefinition | undefined>;
  architect?: Record<string, Partial<TargetDefinition> | undefined>;
  root: string;
  prefix?: string;
  sourceRoot?: string;
}

export interface WorkspaceDefinition {
  root?: string;
  projects: Record<string, ProjectDefinition>;
}

export const getWorkspaceDefinition = (dir: string): WorkspaceDefinition => {
  const workspaceDefPath = findWorkspaceDefPath(dir);

  if (workspaceDefPath == null) {
    throw new Error(
      'Cannot find workspace definition to load "target" options from'
    );
  }

  let workspaceDef = JSON.parse(
    readFileSync(workspaceDefPath, {
      encoding: 'utf-8',
    })
  ) as WorkspaceDefinition;

  const root = dirname(workspaceDefPath);
  if (workspaceDef?.projects) {
    const firstProject = Object.values(workspaceDef?.projects)?.[0];
    const isUsingPerProjectConfig = typeof firstProject === 'string';
    if (isUsingPerProjectConfig) {
      workspaceDef = {
        ...workspaceDef,
        projects: getExtractedPerProjectConfig(root, workspaceDef),
      };
    }
  }

  return {
    ...workspaceDef,
    root,
  };
};

const getExtractedPerProjectConfig = (
  root: string,
  workspaceDef: WorkspaceDefinition
): Record<string, ProjectDefinition> => {
  const extractedProjects = {};
  Object.keys(workspaceDef.projects).forEach((projectKey) => {
    const standaloneDef: ProjectDefinition = JSON.parse(
      readFileSync(
        resolve(root, `${workspaceDef.projects[projectKey]}/project.json`),
        {
          encoding: 'utf-8',
        }
      )
    );
    extractedProjects[projectKey] = standaloneDef;
  });
  return extractedProjects;
};

const findWorkspaceDefPath = (
  dir: PathLike,
  maxRecursion = 10
): string | undefined => {
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
