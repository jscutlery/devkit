/* Import jest functions manually as they conflict with cypress
 * because @cypress/webpack-dev-server references cypress types */
import { describe, expect, it } from '@jest/globals';
import { Target, WorkspaceJsonConfiguration } from '@nrwl/devkit';
import { findTargetOptions } from './find-target-options';

describe(findTargetOptions.name, () => {
  const processedTarget: Target = {
    project: 'test-example',
    target: 'build',
    configuration: 'prod',
  };
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return undefined when no options found in workspace def', () => {
    const workspaceDef: WorkspaceJsonConfiguration = {
      version: 1,
      projects: {},
    };
    expect(findTargetOptions(workspaceDef, processedTarget)).toBeUndefined();
  });

  it('should find target options', () => {
    const workspaceDef: WorkspaceJsonConfiguration = {
      version: 1,
      projects: {
        [processedTarget.project]: {
          root: '',
          targets: {
            [processedTarget.target]: {
              executor: '',
              options: {
                value: 42,
              },
            },
          },
        },
      },
    };
    expect(findTargetOptions(workspaceDef, processedTarget)).toEqual({
      value: 42,
    });
  });
  it('should find target options with configuration', () => {
    const workspaceDef: WorkspaceJsonConfiguration = {
      version: 1,
      projects: {
        [processedTarget.project]: {
          root: '',
          targets: {
            [processedTarget.target]: {
              executor: '',
              configurations: {
                [processedTarget.configuration]: {
                  value: 42,
                },
              },
            },
          },
        },
      },
    };
    expect(findTargetOptions(workspaceDef, processedTarget)).toEqual({
      value: 42,
    });
  });
});
