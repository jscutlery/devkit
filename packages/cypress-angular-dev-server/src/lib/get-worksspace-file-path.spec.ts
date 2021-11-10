import { describe, expect, it } from '@jest/globals';
import * as mock from 'mock-fs';
import { normalize } from 'path';
import { getWorkspaceFilePath } from './get-worksspace-file-path';

describe(getWorkspaceFilePath.name, () => {
  const noJsonDir = 'path/to/fake/dir';
  const workspaceJsonDir = 'workspace-example';
  const angularJsonDir = 'angular-workspace-example';

  beforeEach(() => {
    mock({
      [noJsonDir]: {
        'some-file.txt': '',
        'empty-dir': {},
      },
      [workspaceJsonDir]: {
        'workspace.json': '',
      },
      [angularJsonDir]: {
        'angular.json': '',
      },
    });
  });
  afterEach(() => {
    mock.restore();
  });
  it('should return undefined when no angular or workspace json in the given directory', () => {
    expect(getWorkspaceFilePath(noJsonDir)).toBe(undefined);
  });
  it('should return angular json file path when it exists in the given directory', () => {
    const filePath = getWorkspaceFilePath(angularJsonDir);
    expect(filePath).toMatch(normalize(`${angularJsonDir}/angular.json`));
  });
  it('should return workspace json file path when it exists in the given directory', () => {
    const filePath = getWorkspaceFilePath(workspaceJsonDir);
    expect(filePath).toMatch(normalize(`${workspaceJsonDir}/workspace.json`));
  });
});
