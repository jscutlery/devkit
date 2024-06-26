/* eslint-disable @angular-eslint/component-class-suffix */

import { Component, Injectable, input, Type } from '@angular/core';
import { createComponent } from './testing';

describe('swc-angular-plugin: input', () => {
  it('should bind inputs', () => {
    @Component({
      standalone: true,
      selector: 'jsc-title',
      template: ` <h1>Hello {{ title() }}!</h1> `,
    })
    class Title {
      title = input<string>();
    }

    @Component({
      standalone: true,
      imports: [Title],
      template: ` <jsc-title [title]="title" /> `,
    })
    class Container {
      title = 'input';
    }

    const { heading } = render(Container);
    expect(heading).toBe('Hello input!');
  });

  it('should bind required inputs', () => {
    @Component({
      standalone: true,
      selector: 'jsc-title',
      template: ` <h1>Hello {{ title() }}!</h1> `,
    })
    class Title {
      title = input.required<string>();
    }

    @Component({
      standalone: true,
      imports: [Title],
      template: ` <jsc-title [title]="title" /> `,
    })
    class Container {
      title = 'required input';
    }

    const { heading } = render(Container);
    expect(heading).toBe('Hello required input!');
  });

  it('should bind aliased inputs', () => {
    @Component({
      standalone: true,
      selector: 'jsc-title',
      template: ` <h1>Hello {{ myTitle() }}!</h1> `,
    })
    class Title {
      myTitle = input('', { alias: 'title' });
    }

    @Component({
      standalone: true,
      imports: [Title],
      template: ` <jsc-title [title]="title" /> `,
    })
    class Container {
      title = 'input alias';
    }

    const { heading } = render(Container);
    expect(heading).toBe('Hello input alias!');
  });

  it('should bind required aliased inputs', () => {
    @Component({
      standalone: true,
      selector: 'jsc-title',
      template: `<h1>Hello {{ myTitle() }}!</h1>`,
    })
    class Title {
      myTitle = input.required<string>({ alias: 'title' });
    }

    @Component({
      standalone: true,
      imports: [Title],
      template: '<jsc-title [title]="title"/>',
    })
    class Container {
      title = 'required input alias';
    }

    const { heading } = render(Container);
    expect(heading).toBe('Hello required input alias!');
  });

  /* Cf. https://github.com/jscutlery/devkit/issues/304 */
  it.fails(
    '🐞 should bind inputs even when property is assigned using constructor injection',
    () => {
      @Component({
        standalone: true,
        selector: 'jsc-title',
        template: ` <h1>Hello {{ title() }}!</h1> `,
      })
      class Title {
        title = input<string>();

        constructor(private _service: Service) {}
      }

      @Component({
        standalone: true,
        imports: [Title],
        template: ` <jsc-title [title]="title" /> `,
      })
      class Container {
        title = 'input';
      }

      const { heading } = render(Container);
      expect(heading).toBe('Hello input!');
    },
  );

  function render(cmpType: Type<unknown>) {
    const { nativeElement } = createComponent(cmpType);
    return {
      heading: nativeElement.querySelector('h1')?.textContent,
    };
  }
});

@Injectable({
  providedIn: 'root',
})
class Service {}
