import { ComponentHarness, ComponentHarnessConstructor } from '@angular/cdk/testing';

import { addHarnessMethodsToChainer, createRootEnvironment, getTestBedRoot } from './internals';

export function getRootHarness<T extends ComponentHarness>(
  harnessType: ComponentHarnessConstructor<T>
) {
  /* Create a local variable so `pipe` can log name. */
  const getRootHarness = ($documentRoot: JQuery<Element>) => new harnessType(
    createRootEnvironment($documentRoot)
  );

  return addHarnessMethodsToChainer(
    getTestBedRoot().pipe(getRootHarness),
    harnessType
  );
}
