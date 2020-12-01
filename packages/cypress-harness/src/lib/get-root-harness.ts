import {
  ComponentHarness,
  ComponentHarnessConstructor,
} from '@angular/cdk/testing';
import { CypressHarnessEnvironment } from './cypress-harness-environment';
import { addHarnessMethodsToChainer } from './internals';

export function getRootHarness<T extends ComponentHarness>(
  harnessType: ComponentHarnessConstructor<T>
) {
  /* Create a local variable so `pipe` can log name. */
  const getRootHarness = (root) =>
    new harnessType(
      new CypressHarnessEnvironment(root, { documentRoot: root })
    );

  return addHarnessMethodsToChainer(
    cy.get('#root0').pipe(getRootHarness),
    harnessType
  );
}
