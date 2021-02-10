import {
  ComponentHarness,
  ComponentHarnessConstructor,
} from '@angular/cdk/testing';

import { CypressHarnessEnvironment } from './cypress-harness-environment';
import { addHarnessMethodsToChainer, getDocumentRoot } from './internals';

export function getRootHarness<T extends ComponentHarness>(
  harnessType: ComponentHarnessConstructor<T>
) {
  /* Create a local variable so `pipe` can log name. */
  const getRootHarness = ($documentRoot: JQuery<Element>) => {
    const documentRoot = $documentRoot.get(0);
    const rootEl =
      /* This is the selector when using `@jscutlery/cypress-mount>=0.5.0` (real app bootstrap). */
      documentRoot.querySelector('#root') ??
      /* This is the selector when using `@jscutlery/cypress-mount<0.5.0` (TestBed). */
      documentRoot.querySelector('#root0');
    return new harnessType(
      new CypressHarnessEnvironment(rootEl, {
        documentRoot,
      })
    );
  };

  return addHarnessMethodsToChainer(
    getDocumentRoot().pipe(getRootHarness),
    harnessType
  );
}
