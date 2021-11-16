import { describe, expect, it } from '@jest/globals';
import { getWorkspaceConfiguration } from './get-workspace-configuration';
import * as mock from 'mock-fs';
import { ProjectConfiguration } from '@nrwl/devkit';

describe(getWorkspaceConfiguration.name, () => {
  const workspaceJsonDir = 'workspace-example';
  const angularJsonDir = 'angular-workspace-example';
  const nonCompliantJsonDir = 'non-comliant-json-example';
  const perProjectWorkspaceJsonDir = 'per-project-workspace-json-example';
  const projects = {
    'cypress-angular': 'libs/cypress-angular',
  };
  const project: ProjectConfiguration = {
    targets: {
      build: {
        executor: 'test',
      },
    },
    root: '',
  };

  const perProjectWorkspaceJson = `{
    "version": 2,
    "projects": ${JSON.stringify(projects)}
  }`;
  const workspaceJson = `{ "projects": { "test": ${JSON.stringify(project)} }}`;
  beforeEach(() => {
    mock({
      [nonCompliantJsonDir]: {
        'workspace.json': '',
      },
      [workspaceJsonDir]: {
        'workspace.json': workspaceJson,
      },
      [angularJsonDir]: {
        'angular.json': workspaceJson,
      },
      [perProjectWorkspaceJsonDir]: {
        'workspace.json': perProjectWorkspaceJson,
        libs: {
          'cypress-angular': {
            'project.json': `${JSON.stringify(project)}`,
          },
        },
      },
    });
  });
  afterEach(() => {
    mock.restore();
  });

  it('should throw error when workspace def is not JSON compliant', () => {
    expect(() => getWorkspaceConfiguration(nonCompliantJsonDir)).toThrowError(
      new Error('Unexpected end of JSON input')
    );
  });
  it('should return parsed workspace json', () => {
    const workspaceDef = getWorkspaceConfiguration(workspaceJsonDir);
    expect(workspaceDef.projects).toEqual({ test: project });
  });
  it('should return parsed angular json', () => {
    const workspaceDef = getWorkspaceConfiguration(angularJsonDir);
    expect(workspaceDef.projects).toEqual({ test: project });
  });
  it('should return parsed workspace json with extracted per project config', () => {
    const workspaceDef = getWorkspaceConfiguration(perProjectWorkspaceJsonDir);
    expect(workspaceDef.projects).toEqual({ 'cypress-angular': project });
  });
});
