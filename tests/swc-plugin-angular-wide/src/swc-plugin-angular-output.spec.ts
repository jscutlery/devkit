/* eslint-disable @angular-eslint/component-class-suffix */

import { Component, output, signal, Type } from '@angular/core';
import { createComponent } from './testing';

describe('swc-plugin-angular: output', () => {
  it('should bind outputs', () => {
    @Component({
      standalone: true,
      selector: 'jsc-button',
      template: `
        <button (click)='action.emit(42)'>Click me!</button>
      `
    })
    class Button {
      action = output<number>();
    }

    @Component({
      standalone: true,
      imports: [
        Button
      ],
      template: `
        <jsc-button (action)='result.set($event)' />
        <p>{{ result() }}</p>
      `
    })
    class Container {
      result = signal<number | null>(null);
    }

    const { clickButton, getParagraph } = render(Container);
    clickButton();
    expect(getParagraph()).toBe('42');
  });

  it('should bind aliased outputs', () => {
    @Component({
      standalone: true,
      selector: 'jsc-button',
      template: `
        <button (click)='myAction.emit(42)'>Click me!</button>
      `
    })
    class Button {
      myAction = output<number>({ alias: 'action'});
    }

    @Component({
      standalone: true,
      imports: [
        Button
      ],
      template: `
        <jsc-button (action)='result.set($event)' />
        <p>{{ result() }}</p>
      `
    })
    class Container {
      result = signal<number | null>(null);
    }

    const { clickButton, getParagraph } = render(Container);
    clickButton();
    expect(getParagraph()).toBe('42');
  });


  function render(cmpType: Type<unknown>) {
    const { nativeElement } = createComponent(cmpType);
    return {
      clickButton() {
        nativeElement.querySelector('button')?.click();
      },
      getParagraph() {
        return nativeElement.querySelector('p')?.textContent;
      }
    };
  }
});
