/* eslint-disable @angular-eslint/component-class-suffix */

import { fakeAsync, tick } from '@angular/core/testing';

describe('swc-angular-plugin: fakeAsync', () => {
  /* Cf. https://github.com/jscutlery/devkit/issues/303 */
  it('should work with fakeAsync + tick + async/await', fakeAsync(async () => {
    await Promise.resolve();

    expect(() => tick()).not.toThrow();
  }));
});
