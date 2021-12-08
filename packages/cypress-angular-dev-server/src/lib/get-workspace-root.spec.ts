import { describe, expect, it } from '@jest/globals';
import { getWorkspaceRoot } from './get-workspace-root';
import mock from 'mock-fs';

describe(getWorkspaceRoot.name, () => {
  const fakeDir = 'path/to/fake/dir';
  const workspaceJsonDir = 'workspace-example';
  const angularJsonDir = 'angular-workspace-example';
  const libraryDir = 'libs/library-example';

  beforeEach(() => {
    mock({
      [fakeDir]: {
        'some-file.txt': '',
        'empty-dir': {},
      },
      [workspaceJsonDir]: {
        'workspace.json': '',
        libs: {
          'library-example': {},
        },
      },
      [angularJsonDir]: {
        'angular.json': '',
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
    expect(() => getWorkspaceRoot(fakeDir)).toThrowError(
      new Error(
        'Cannot find workspace definition to load "target" options from'
      )
    );
  });
  it('should recursively find workspace root when it has a angular json', () => {
    const workspaceRoot = getWorkspaceRoot(`${angularJsonDir}/${libraryDir}`);
    expect(workspaceRoot).toMatch(angularJsonDir);
  });
  it('should recursively find workspace root when it has a workspace json', () => {
    const workspaceDef = getWorkspaceRoot(`${workspaceJsonDir}/${libraryDir}`);
    expect(workspaceDef).toMatch(workspaceJsonDir);
  });
});
