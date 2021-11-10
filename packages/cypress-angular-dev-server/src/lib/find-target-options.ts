import {
  ProjectConfiguration,
  Target,
  WorkspaceJsonConfiguration,
} from '@nrwl/devkit';

export function findTargetOptions(
  workspaceDef: WorkspaceJsonConfiguration,
  processedTarget: Target
): Record<string, unknown> | undefined {
  const { project, target, configuration } = processedTarget;
  const projectDef: ProjectConfiguration = workspaceDef?.projects?.[project];
  const targetDef = projectDef?.targets?.[target];
  return targetDef?.options ?? targetDef?.configurations?.[configuration];
}
