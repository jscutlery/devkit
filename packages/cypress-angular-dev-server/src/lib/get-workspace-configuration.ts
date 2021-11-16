import { ProjectConfiguration, WorkspaceJsonConfiguration } from '@nrwl/devkit';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { getWorkspaceFilePath } from './get-worksspace-file-path';

export const getWorkspaceConfiguration = (
  workspaceRoot: string
): WorkspaceJsonConfiguration => {
  let workspaceDef = JSON.parse(
    readFileSync(getWorkspaceFilePath(workspaceRoot), {
      encoding: 'utf-8',
    })
  ) as WorkspaceJsonConfiguration;

  if (workspaceDef?.projects) {
    const firstProject = Object.values(workspaceDef?.projects)?.[0];
    const isUsingPerProjectConfig = typeof firstProject === 'string';
    if (isUsingPerProjectConfig) {
      workspaceDef = getExtractedPerProjectConfig(workspaceRoot, workspaceDef);
    }
  }

  return workspaceDef;
};

const getExtractedPerProjectConfig = (
  root: string,
  workspaceDef: WorkspaceJsonConfiguration
): WorkspaceJsonConfiguration => {
  const workspaceJson: WorkspaceJsonConfiguration = {
    version: 1,
    projects: {},
  };
  Object.keys(workspaceDef.projects).forEach((projectKey) => {
    const standaloneDef: ProjectConfiguration = JSON.parse(
      readFileSync(
        resolve(root, `${workspaceDef.projects[projectKey]}/project.json`),
        {
          encoding: 'utf-8',
        }
      )
    );
    workspaceJson.projects[projectKey] = standaloneDef;
  });
  return workspaceJson;
};
