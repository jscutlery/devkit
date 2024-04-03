/* eslint-disable @angular-eslint/component-class-suffix */

import { Component, contentChild, ElementRef, Type } from '@angular/core';
import { createComponent } from './testing';

describe('swc-plugin-angular: content child', () => {
  it('should match required content child', () => {

    @Component({
      standalone: true,
      selector: 'jsc-child',
      template: `
        <p>{{ paragraph() }}</p>
      `
    })
    class Child {
      titleEl = contentChild('title', { read: ElementRef<HTMLHeadingElement> });
      paragraph = () => this.titleEl()?.nativeElement.textContent;
    }

    @Component({
      standalone: true,
      imports: [Child],
      template: `
        <jsc-child>
          <h1 #title>Hello content child!</h1>
        </jsc-child>
      `
    })
    class Container {
    }

    const { paragraph } = render(Container);
    expect(paragraph).toBe('Hello content child!');
  });

  function render(cmpType: Type<unknown>) {
    const { nativeElement } = createComponent(cmpType);
    return {
      paragraph: nativeElement.querySelector('p')?.textContent
    };
  }
});
