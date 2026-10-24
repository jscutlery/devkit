/* eslint-disable @angular-eslint/component-class-suffix */

import { Component, computed, Injectable, input, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
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

  it('should bind inputs even when property is assigned using constructor injection', () => {
    @Component({
      standalone: true,
      selector: 'jsc-title',
      template: ` <h1>Hello {{ title() }}!</h1> `,
    })
    class Title {
      title = input<string>();

      // eslint-disable-next-line @angular-eslint/prefer-inject
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
  });

  it('should set required inputs with setInput when constructor has parameter properties', () => {
    @Component({
      standalone: true,
      selector: 'jsc-title',
      template: ` <h1>Hello {{ upperTitle() }}!</h1> `,
    })
    class Title {
      title = input.required<string>();
      upperTitle = computed(() => this.title().toUpperCase());

      // eslint-disable-next-line @angular-eslint/prefer-inject
      constructor(private _service: Service) {}
    }

    const fixture = TestBed.createComponent(Title);
    fixture.componentRef.setInput('title', 'input');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toBe(
      'Hello INPUT!',
    );
  });

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
