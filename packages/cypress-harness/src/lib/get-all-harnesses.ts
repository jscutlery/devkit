import { ComponentHarness, HarnessQuery } from '@angular/cdk/testing';
import { CypressHarnessEnvironment } from './cypress-harness-environment';

export function getAllHarnesses<T extends ComponentHarness>(
  query: HarnessQuery<T>
) {
  /* Create a local variable so `pipe` can log name. */
  const getAllHarnesses = (body) =>
    new CypressHarnessEnvironment(body, { documentRoot: body }).getAllHarnesses(query);

  return cy.get('body').pipe(getAllHarnesses);
}
