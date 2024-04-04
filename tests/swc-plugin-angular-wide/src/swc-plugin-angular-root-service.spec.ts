/* eslint-disable @angular-eslint/component-class-suffix */

import { Injectable, Component, inject, Type } from '@angular/core';
import { createComponent } from './testing';

describe('swc-plugin-angular: root service', () => {
  it('should provide root service', () => {
    @Injectable({
      providedIn: 'root',
    })
    class RootService {
      value = 'root service';
    }

    @Component({
      standalone: true,
      template: ` <h1>{{ value }}</h1> `,
    })
    class Container {
      value = inject(RootService).value;
    }

    const { heading } = render(Container);
    expect(heading).toBe('root service');
  });

  function render(cmpType: Type<unknown>) {
    const { nativeElement } = createComponent(cmpType);
    return {
      heading: nativeElement.querySelector('h1')?.textContent,
    };
  }
});
