/* eslint-disable @angular-eslint/component-class-suffix */

import { Component, inject, Injectable, Type } from '@angular/core';
import { createComponent } from './testing';

describe('swc-angular-plugin: root service', () => {
  it('should provide root service using inject function', () => {
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

  it('should provide root service using constructor injection', () => {
    @Injectable({
      providedIn: 'root',
    })
    class RootService {
      value = 'root service';
    }

    @Component({
      standalone: true,
      template: ` <h1>{{ rootService.value }}</h1> `,
    })
    class Container {
      // eslint-disable-next-line @angular-eslint/prefer-inject
      constructor(public rootService: RootService) {}
    }

    const { heading } = render(Container);
    expect(heading).toBe('root service');
  });

  function render(cmpType: Type<unknown>, providers: any[] = []) {
    const { nativeElement } = createComponent(cmpType, providers);
    return {
      heading: nativeElement.querySelector('h1')?.textContent,
    };
  }
});
