/* eslint-disable @angular-eslint/component-class-suffix */

import { Component, Type } from '@angular/core';
import { createComponent } from './testing';

describe('swc-plugin-angular: urls', () => {
  it('should load component with templateUrl & styleUrl', () => {
    @Component({
      standalone: true,
      templateUrl: './test.component.html',
      styleUrl: './test.component.css'
    })
    class Container {
    }

    const { heading } = render(Container);
    expect(heading).toBe('Hello templateUrl!');
  });

  function render(cmpType: Type<unknown>) {
    const { nativeElement } = createComponent(cmpType);
    return {
      heading: nativeElement.querySelector('h1')?.textContent
    };
  }
});
