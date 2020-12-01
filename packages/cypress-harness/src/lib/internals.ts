import {
  ComponentHarness,
  ComponentHarnessConstructor,
} from '@angular/cdk/testing';

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
            /* Using a container in order to dynamically set the
             * function's name as `cypress-pipe` will use the function's
             * name in logs. */
            const container = {
              [methodName]: (harness) => harness[methodName](...args),
            };
            return chainer.pipe(container[methodName]);
          },
        };
      }, {}),
  };
  return chainer as any;
}
