/// <reference types="cypress"/>
import { setupHooks } from '@cypress/mount-utils';

/**
 * @hack fixes dependency injection in JIT
 */
import 'reflect-metadata';

/**
 * @hack we have to import `zone.js/dist/zone-testing`.
 * This is due to implicit call to `resetFakeAsyncZone()`
 * in `@angular/core/testing`.
 * Cf. https://github.com/jscutlery/utils/issues/2
 */
import 'zone.js/dist/zone';

/**
 * @hack fixes "Mocha has already been patched with Zone" error.
 */
(globalThis as unknown)['Mocha']['__zone_patch__'] = false;
import 'zone.js/dist/zone-testing';

/**
 * @see {@link https://github.com/bahmutov/cypress-angular-unit-test/blame/master/support.js}.
 */
beforeEach(() =>
  cy.document().then((document) => {
    document.write(`
  <head>
    <meta charset="UTF-8">
    <base href="/">
  </head>
    <body>
      <div id="root"></root0>
    </body>
  `);
    document.close();
  })
);

/**
 * Cleanup global style and ensure hooks correctly configured.
 * @see https://github.com/cypress-io/cypress/blob/d4f81e8e7839741cc9a2df739f46b993b09b7ea2/npm/mount-utils/src/index.ts#L192
 */
setupHooks();
