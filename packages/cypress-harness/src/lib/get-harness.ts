import { ComponentHarness, HarnessQuery } from '@angular/cdk/testing';

import { addHarnessMethodsToChainer, createRootEnvironment, getDocumentRoot } from './internals';

export function getHarness<T extends ComponentHarness>(query: HarnessQuery<T>) {
  /* Create a local variable so `pipe` can log name. */
  const getHarness = ($documentRoot: JQuery<Element>) =>
    createRootEnvironment($documentRoot).getHarness(query);

  const harnessType = 'harnessType' in query ? query.harnessType : query;

  return addHarnessMethodsToChainer(
    getDocumentRoot().pipe(getHarness),
    harnessType
  );
}
