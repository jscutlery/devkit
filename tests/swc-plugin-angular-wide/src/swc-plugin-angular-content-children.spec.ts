/* eslint-disable @angular-eslint/component-class-suffix */

import { Component, contentChildren, ElementRef, Type } from '@angular/core';
import { createComponent } from './testing';

describe('swc-plugin-angular: content children', () => {
  it('should match required content children', () => {

    @Component({
      standalone: true,
      selector: 'jsc-child',
      template: `
        <p>{{ paragraph() }}</p>
      `
    })
    class Child {
      itemEls = contentChildren('item', { read: ElementRef<HTMLHeadingElement> });
      paragraph = () => this.itemEls()?.map(el => el.nativeElement.textContent).join(',');
    }

    @Component({
      standalone: true,
      imports: [Child],
      template: `
        <jsc-child>
          <li #item>Hello content child 1!</li>
          <li #item>Hello content child 2!</li>
        </jsc-child>
      `
    })
    class Container {
    }

    const { paragraph } = render(Container);
    expect(paragraph).toBe('Hello content child 1!,Hello content child 2!');
  });

  function render(cmpType: Type<unknown>) {
    const { nativeElement } = createComponent(cmpType);
    return {
      paragraph: nativeElement.querySelector('p')?.textContent
    };
  }
});
