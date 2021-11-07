import { Target } from '@angular-devkit/architect';
import {
  ProjectDefinition,
  WorkspaceDefinition,
} from './get-workspace-definition';

export function findTargetOptions(
  workspaceDef: WorkspaceDefinition,
  processedTarget: Target
): Record<string, unknown> | undefined {
  const { project, target, configuration } = processedTarget;
  const projectDef: ProjectDefinition = workspaceDef?.projects?.[project];

  if (projectDef == undefined) {
    return undefined;
  }

  const targetDef =
    projectDef?.targets?.[target] ?? projectDef?.architect?.[target];
  return targetDef?.options ?? targetDef.configurations?.[configuration];
}
