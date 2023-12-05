import 'cypress-pipe';

/**
 * @hack we have to import `zone.js/dist/zone-testing`.
 * This is due to implicit call to `resetFakeAsyncZone()`
 * in `@angular/core/testing`.
 * Cf. https://github.com/jscutlery/devkit/issues/2
 */
import 'zone.js';

/* @hack fixes "Mocha has already been patched with Zone" error. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any)['Mocha']['__zone_patch__'] = false;

import 'zone.js/testing';
