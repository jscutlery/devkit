import { ComponentHarness, HarnessQuery } from '@angular/cdk/testing';
import { CypressHarnessEnvironment } from './cypress-harness-environment';

export function getHarness<T extends ComponentHarness>(query: HarnessQuery<T>) {
  /* Create a local variable so `pipe` can log name. */
  const getHarness = (body) =>
    new CypressHarnessEnvironment(body, { documentRoot: body }).getHarness(query);

  return cy.get('body').pipe(getHarness);
}

