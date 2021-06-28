/* eslint-disable @typescript-eslint/no-explicit-any */
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

  return new Proxy<ChainableHarness<HARNESS>>({} as any, {
    get: (_, prop) =>
      (addHarnessMethodsToChainer(getDocumentRoot().pipe(getHarness)) as any)[prop],
  });
}
