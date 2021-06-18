import { ComponentHarness, HarnessQuery } from '@angular/cdk/testing';

import { createRootEnvironment, getDocumentRoot } from './internals';

export function getAllHarnesses<HARNESS extends ComponentHarness>(
  query: HarnessQuery<HARNESS>
): Promise<HARNESS[]> {
  /* Create a local variable so `pipe` can log name. */
  const getAllHarnesses = ($documentRoot: JQuery<Element>) =>
    createRootEnvironment($documentRoot).getAllHarnesses(query);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Proxy({} as any, {
    get: (_target, prop) => getDocumentRoot().pipe(getAllHarnesses)[prop],
  });
}
