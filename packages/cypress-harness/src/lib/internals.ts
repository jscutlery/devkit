import {
  ComponentHarness,
  ComponentHarnessConstructor,
} from '@angular/cdk/testing';
import { CypressHarnessEnvironment } from './cypress-harness-environment';

/**
 * Adds harness methods to chainer.
 *
 * Given a harness with a `getValue()` method,
 * users can call `getHarness().getValue()`
 * instead of `getHarness().invoke('getValue')`
 */
export function addHarnessMethodsToChainer<
  HARNESS extends ComponentHarness,
  METHOD_NAME extends keyof HARNESS,
  METHOD extends ((...args: unknown[]) => unknown) & HARNESS[METHOD_NAME],
  RETURN_TYPE = ReturnType<METHOD>
>(
  chainer: Cypress.Chainable<HARNESS>,
  harnessConstructor: ComponentHarnessConstructor<HARNESS>
): Cypress.Chainable<HARNESS> &
  {
    [K in METHOD_NAME]: (
      ...args: Parameters<METHOD>
    ) => Cypress.Chainable<RETURN_TYPE>;
  } {
  const harnessProto = harnessConstructor['prototype'];
  chainer['__proto__'] = {
    ...chainer['__proto__'],
    ...harnessProto,
    ...Object.getOwnPropertyNames(harnessProto)
      .filter((methodName) => methodName !== 'constructor')
      .reduce((proto, methodName) => {
        return {
          ...proto,
          [methodName](...args) {
            return chainer.invoke(methodName, ...args);
          },
        };
      }, {}),
  };
  return chainer as any;
}

export function getTestBedRoot() {
  return cy.get('#root0');
}

export function createRootEnvironment($documentRoot: JQuery<Element>): CypressHarnessEnvironment {
  const documentRoot = $documentRoot.get(0);
  return new CypressHarnessEnvironment(documentRoot, { documentRoot })
}
