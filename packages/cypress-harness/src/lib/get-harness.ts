import { ComponentHarness, HarnessQuery } from '@angular/cdk/testing';

import {
  addHarnessMethodsToChainer,
  ChainableHarness,
  createRootEnvironment,
  getDocumentRoot,
} from './internals';

export function getHarness<HARNESS extends ComponentHarness>(
  query: HarnessQuery<HARNESS>
): ChainableHarness<HARNESS> {
  /* Create a local variable so `pipe` can log name. */
  const getHarness = ($documentRoot: JQuery<Element>) =>
    createRootEnvironment($documentRoot).getHarness(query);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Proxy<ChainableHarness<HARNESS>>({} as any, {
    get: (_target, prop) =>
      addHarnessMethodsToChainer(getDocumentRoot().pipe(getHarness))[prop],
  });
}
