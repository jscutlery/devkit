import { ComponentHarness, HarnessQuery } from '@angular/cdk/testing';
import { CypressHarnessEnvironment } from './cypress-harness-environment';

export function getAllHarnesses<T extends ComponentHarness>(
  query: HarnessQuery<T>
) {
  /* Create a local variable so `pipe` can log name. */
  const getAllHarnesses = ($documentRoot) => {
    const documentRoot = $documentRoot.get(0);
    return new CypressHarnessEnvironment(documentRoot, { documentRoot }).getAllHarnesses(query);
  }

  return cy.get('body').pipe(getAllHarnesses);
}
