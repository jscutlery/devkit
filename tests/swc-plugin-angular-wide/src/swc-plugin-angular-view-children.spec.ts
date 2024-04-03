/* eslint-disable @angular-eslint/component-class-suffix */

import { Component, ElementRef, Type, viewChildren } from '@angular/core';
import { createComponent } from './testing';

describe('swc-plugin-angular: view children', () => {
  it('should match view children', () => {
    @Component({
      standalone: true,
      template: `
        <ul>
          <li #item>Hello child 1!</li>
          <li #item>Hello child 2!</li>
        </ul>
        <p>{{ paragraph() }}</p>
      `
    })
    class Container {
      itemEls = viewChildren('item', { read: ElementRef<HTMLElement> });
      paragraph = () => this.itemEls().map(el => el.nativeElement.textContent).join(',');
    }

    const { paragraph } = render(Container);
    expect(paragraph).toBe('Hello child 1!,Hello child 2!');
  });

  function render(cmpType: Type<unknown>) {
    const { nativeElement } = createComponent(cmpType);
    return {
      paragraph: nativeElement.querySelector('p')?.textContent
    };
  }
});
