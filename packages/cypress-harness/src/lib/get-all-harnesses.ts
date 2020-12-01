import { ComponentHarness, HarnessQuery } from '@angular/cdk/testing';

import { createRootEnvironment, getDocumentRoot } from './internals';

export function getAllHarnesses<T extends ComponentHarness>(
  query: HarnessQuery<T>
) {
  /* Create a local variable so `pipe` can log name. */
  const getAllHarnesses = ($documentRoot: JQuery<Element>) =>
    createRootEnvironment($documentRoot).getAllHarnesses(query);

  return getDocumentRoot().pipe(getAllHarnesses);
}
