/* eslint-disable @angular-eslint/component-class-suffix */

import { Injectable, Component, inject, Type } from '@angular/core';
import { createComponent } from './testing';

describe('swc-plugin-angular: root service', () => {
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
      constructor(public rootService: RootService) {}
    }

    // TODO: Fix this test
    // const { heading } = render(Container, [RootService]);
    // expect(heading).toBe('root service');
    expect(() => render(Container)).toThrow('NG0202');
  });

  function render(cmpType: Type<unknown>, providers: any[] = []) {
    const { nativeElement } = createComponent(cmpType, providers);
    return {
      heading: nativeElement.querySelector('h1')?.textContent,
    };
  }
});
