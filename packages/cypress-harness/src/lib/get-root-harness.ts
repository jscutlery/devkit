import {
  ComponentHarness,
  ComponentHarnessConstructor,
} from '@angular/cdk/testing';
import { CypressHarnessEnvironment } from './cypress-harness-environment';
import { addHarnessMethodsToChainer, getTestBedRoot } from './internals';

export function getRootHarness<T extends ComponentHarness>(
  harnessType: ComponentHarnessConstructor<T>
) {
  /* Create a local variable so `pipe` can log name. */
  const getRootHarness = (documentRoot) =>
    new harnessType(
      new CypressHarnessEnvironment(documentRoot, { documentRoot })
    );

  return addHarnessMethodsToChainer(
    getTestBedRoot().pipe(getRootHarness),
    harnessType
  );
}
