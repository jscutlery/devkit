/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentHarness, HarnessQuery } from '@angular/cdk/testing';

import { ChainableHarness, createRootEnvironment, getDocumentRoot } from './internals';

export function getAllHarnesses<HARNESS extends ComponentHarness>(
  query: HarnessQuery<HARNESS>
): ChainableHarness<HARNESS[]> {
  /* Create a local variable so `pipe` can log name. */
  const getAllHarnesses = ($documentRoot: JQuery<Element>) =>
    createRootEnvironment($documentRoot).getAllHarnesses(query);

  return new Proxy({} as any, {
    get: (_, prop) => (getDocumentRoot().pipe(getAllHarnesses) as any)[prop],
  });
}
