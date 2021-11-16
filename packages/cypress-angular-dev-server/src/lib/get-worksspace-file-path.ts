import { existsSync } from 'fs';
import { resolve } from 'path';

export const getWorkspaceFilePath = (dir: string): string | undefined => {
  const workspaceJsonPath = resolve(dir, 'workspace.json');
  if (existsSync(workspaceJsonPath)) {
    return workspaceJsonPath;
  }
  const angularJsonPath = resolve(dir, 'angular.json');
  if (existsSync(angularJsonPath)) {
    return angularJsonPath;
  }
};
