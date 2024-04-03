/* eslint-disable @angular-eslint/component-class-suffix */

import { Component, Type } from '@angular/core';
import { TitleComponent } from './fixtures/title.component';
import { createComponent } from './testing';

/* This test makes sure that the plugin works even when the component
 * is not inlined in the test. */
describe('swc-plugin-angular: separate component file', () => {
  it('should bind inputs', () => {
    @Component({
      standalone: true,
      imports: [
        TitleComponent
      ],
      template: `
        <jsc-title [title]='title' />
      `
    })
    class Container {
      title = 'component from another file';
    }

    const { heading } = render(Container);
    expect(heading).toBe('Hello component from another file!');
  });

  function render(cmpType: Type<unknown>) {
    const { nativeElement } = createComponent(cmpType);
    return {
      heading: nativeElement.querySelector('h1')?.textContent
    };
  }
});
