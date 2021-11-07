import { describe, expect, it } from '@jest/globals';
import {
  getWorkspaceDefinition,
  ProjectDefinition,
} from './get-workspace-definition';
import * as mock from 'mock-fs';

describe(getWorkspaceDefinition.name, () => {
  const fakeDir = 'path/to/fake/dir';
  const workspaceJsonDir = 'workspace-example';
  const angularJsonDir = 'angular-workspace-example';
  const nonCompliantJsonDir = 'non-comliant-json-example';
  const perProjectWorkspaceJsonDir = 'per-project-workspace-json-example';
  const libraryDir = 'libs/library-example';
  const projects = {
    'cypress-angular': 'packages/cypress-angular',
  };
  const project: ProjectDefinition = {
    targets: {
      build: {
        builder: 'test',
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
      [fakeDir]: {
        'some-file.txt': '',
        'empty-dir': {},
      },
      [workspaceJsonDir]: {
        'workspace.json': workspaceJson,
        libs: {
          'library-example': {},
        },
      },
      [perProjectWorkspaceJsonDir]: {
        'workspace.json': perProjectWorkspaceJson,
        libs: {
          'library-example': {},
        },
        packages: {
          'cypress-angular': {
            'project.json': `${JSON.stringify(project)}`,
          },
        },
      },
      [angularJsonDir]: {
        'angular.json': '{}',
        libs: {
          'library-example': {},
        },
      },
      [nonCompliantJsonDir]: {
        'workspace.json': '',
        libs: {
          'library-example': {},
        },
      },
    });
  });
  afterEach(() => {
    mock.restore();
  });
  it('should throw error when no workspace def found', () => {
    expect(() => getWorkspaceDefinition(fakeDir)).toThrowError(
      new Error(
        'Cannot find workspace definition to load "target" options from'
      )
    );
  });
  it('should throw error when workspace def is not JSON compliant', () => {
    expect(() =>
      getWorkspaceDefinition(`${nonCompliantJsonDir}/${libraryDir}`)
    ).toThrowError(new Error('Unexpected end of JSON input'));
  });
  it('should recursively find workspace def when it is an angular json', () => {
    const workspaceDef = getWorkspaceDefinition(
      `${angularJsonDir}/${libraryDir}`
    );
    expect(workspaceDef.root).toMatch(angularJsonDir);
  });
  it('should recursively find workspace def when it is an workspace json', () => {
    const workspaceDef = getWorkspaceDefinition(
      `${workspaceJsonDir}/${libraryDir}`
    );
    expect(workspaceDef.root).toMatch(workspaceJsonDir);
  });
  it('should return parsed workspace json', () => {
    const workspaceDef = getWorkspaceDefinition(
      `${workspaceJsonDir}/${libraryDir}`
    );
    expect(workspaceDef.projects).toEqual({ test: project });
  });
  it('should return parsed workspace json with extracted per project config', () => {
    const workspaceDef = getWorkspaceDefinition(
      `${perProjectWorkspaceJsonDir}/${libraryDir}`
    );
    expect(workspaceDef.projects).toEqual({ 'cypress-angular': project });
  });
});
