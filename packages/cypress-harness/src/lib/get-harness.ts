import { ComponentHarness, HarnessQuery } from '@angular/cdk/testing';
import { CypressHarnessEnvironment } from './cypress-harness-environment';
import { getTestBedRoot } from './internals';

export function getHarness<T extends ComponentHarness>(query: HarnessQuery<T>) {
  /* Create a local variable so `pipe` can log name. */
  const getHarness = (body) =>
    new CypressHarnessEnvironment(body, { documentRoot: body }).getHarness(
      query
    );

  return getTestBedRoot().pipe(getHarness);
}
