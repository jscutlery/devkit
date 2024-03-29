/* eslint-disable @angular-eslint/component-class-suffix */

import { Component, ElementRef, Type, viewChild } from '@angular/core';
import { createComponent } from './testing';

describe.skip('swc-plugin-angular: view child', () => {
  it('should match view child', () => {

    @Component({
      standalone: true,
      template: `
        <h1 #title>Hello view child!</h1>
        <p>{{ paragraph() }}</p>
      `
    })
    class Container {
      titleEl = viewChild('title', {read: ElementRef});
      paragraph = () => this.titleEl()?.nativeElement.textContent;
    }

    const { paragraph } = render(Container);
    expect(paragraph).toBe('Hello view child!');
  });

  it.todo('should match required view child');

  it.todo('should match view children');

  function render(cmpType: Type<unknown>) {
    const { nativeElement } = createComponent(cmpType);
    return {
      paragraph: nativeElement.querySelector('p')?.textContent
    };
  }
});
