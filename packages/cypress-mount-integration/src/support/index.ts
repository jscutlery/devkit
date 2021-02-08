import '@jscutlery/cypress-mount/support';

/**
 * @hack fixes dependency injection in JIT
 */
import 'reflect-metadata';


/**
 * @hack we have to import `zone.js/dist/zone-testing`.
 * This is due to implicit call to `resetFakeAsyncZone()`
 * in `@angular/core/testing`.
 * Cf. https://github.com/jscutlery/test-utils/issues/2
 */
import 'zone.js/dist/zone';
/* @hack fixes "Mocha has already been patched with Zone" error. */
(globalThis as unknown)['Mocha']['__zone_patch__'] = false;
import 'zone.js/dist/zone-testing';
