import { ComponentHarness, ComponentHarnessConstructor } from '@angular/cdk/testing';
import { CypressHarnessEnvironment } from './cypress-harness-environment';

export function getRootHarness<T extends ComponentHarness>(harnessType: ComponentHarnessConstructor<T>) {
  /* Create a local variable so `pipe` can log name. */
  const getRootHarness = (root) =>
    new harnessType(new CypressHarnessEnvironment(root, { documentRoot: root }))

  return cy.get('#root0').pipe(getRootHarness);
}

