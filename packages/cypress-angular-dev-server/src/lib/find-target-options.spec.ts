/* Import jest functions manually as they conflict with cypress
 * because @cypress/webpack-dev-server references cypress types */
import { describe, expect, it } from '@jest/globals';
import { findTargetOptions } from './find-target-options';
import { WorkspaceDefinition } from './get-workspace-definition';
import { Target } from '@angular-devkit/architect';

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
    const workspaceDef: WorkspaceDefinition = {
      root: '',
      projects: {},
    };
    expect(findTargetOptions(workspaceDef, processedTarget)).toBeUndefined();
  });

  it('should find target options', () => {
    const workspaceDef: WorkspaceDefinition = {
      root: '',
      projects: {
        [processedTarget.project]: {
          root: '',
          targets: {
            [processedTarget.target]: {
              builder: '',
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
    const workspaceDef: WorkspaceDefinition = {
      root: '',
      projects: {
        [processedTarget.project]: {
          root: '',
          targets: {
            [processedTarget.target]: {
              builder: '',
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
  it('should find target for Angular CLI projects', () => {
    const workspaceDef: WorkspaceDefinition = {
      root: '',
      projects: {
        [processedTarget.project]: {
          root: '',
          architect: {
            [processedTarget.target]: {
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
  it('should find target with configuration for Angular CLI projects', () => {
    const workspaceDef: WorkspaceDefinition = {
      root: '',
      projects: {
        [processedTarget.project]: {
          root: '',
          architect: {
            [processedTarget.target]: {
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
