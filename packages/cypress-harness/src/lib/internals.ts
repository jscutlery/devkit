import {
  ComponentHarness,
  ComponentHarnessConstructor,
} from '@angular/cdk/testing';
import { CypressHarnessEnvironment } from './cypress-harness-environment';
import { getClassMethods } from './helpers';

/**
 * Adds harness methods to chainer.
 *
 * Given a harness with a `getValue()` method,
 * users can call `getHarness().getValue()`
 * instead of `getHarness().invoke('getValue')`
 */
export function addHarnessMethodsToChainer<HARNESS extends ComponentHarness>(
  chainer: Cypress.Chainable<HARNESS>,
  harnessConstructor: ComponentHarnessConstructor<HARNESS>
): Cypress.Chainable<HARNESS> &
  {
    /* For each field or method... is this a method? */
    [K in keyof HARNESS]: HARNESS[K] extends (...args: unknown[]) => unknown
      ? /* It's a method so let's change the return type. */
        (
          ...args: Parameters<HARNESS[K]>
        ) => /* Convert Promise<T> to Chainable<T> and anything else U to Chainable<U>. */
        Cypress.Chainable<
          ReturnType<HARNESS[K]> extends Promise<infer RESULT>
            ? RESULT
            : HARNESS[K]
        >
      : /* It's something else. */
        HARNESS[K];
  } {
  const harnessProto = harnessConstructor['prototype'];

  chainer['__proto__'] = {
    ...chainer['__proto__'],
    ...harnessProto,
    ...getClassMethods(harnessConstructor).reduce((proto, methodName) => {
      return {
        ...proto,
        [methodName](...args) {
          return chainer.invoke(methodName, ...args);
        },
      };
    }, {}),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return chainer as any;
}

export function getDocumentRoot() {
  return cy.get('body', {
    log: false,
  });
}

export function createRootEnvironment(
  $documentRoot: JQuery<Element>
): CypressHarnessEnvironment {
  const documentRoot = $documentRoot.get(0);
  return new CypressHarnessEnvironment(documentRoot, { documentRoot });
}
