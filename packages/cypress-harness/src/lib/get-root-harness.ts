import {
  ComponentHarness,
  ComponentHarnessConstructor,
} from '@angular/cdk/testing';
import { CypressHarnessEnvironment } from './cypress-harness-environment';

export function _addMethods<
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
            return chainer.pipe((harness) => harness[methodName](...args));
          },
        };
      }, {}),
  };
  return chainer as any;
}

export function getRootHarness<T extends ComponentHarness>(
  harnessType: ComponentHarnessConstructor<T>
) {
  /* Create a local variable so `pipe` can log name. */
  const getRootHarness = (root) =>
    new harnessType(
      new CypressHarnessEnvironment(root, { documentRoot: root })
    );

  return _addMethods(cy.get('#root0').pipe(getRootHarness), harnessType);
}
