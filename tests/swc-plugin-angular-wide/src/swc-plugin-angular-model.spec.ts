/* eslint-disable @angular-eslint/component-class-suffix */

import { Component, model, signal, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { createComponent } from './testing';

describe('swc-plugin-angular: model', () => {
  describe('basic', () => {
    @Component({
      standalone: true,
      selector: 'jsc-form',
      imports: [
        FormsModule
      ],
      template: `
        <input type='text' [(ngModel)]='value'>
      `
    })
    class Form {
      value = model<string>();
    }

    @Component({
      standalone: true,
      imports: [
        Form
      ],
      template: `
        <jsc-form [(value)]='value' />
        <p>{{ value() }}</p>
      `
    })
    class Container {
      value = signal<string>('hello');
    }

    it('should bind model', async () => {
      const { getInputValue } = await render(Container);
      expect(getInputValue()).toBe('hello');
    });

    it('should listen to model', async () => {
      const { setInput, getParagraph } = await render(Container);
      setInput('bye');
      expect(getParagraph()).toBe('bye');
    });

  });

  describe('with alias', () => {
    @Component({
      standalone: true,
      selector: 'jsc-form',
      imports: [
        FormsModule
      ],
      template: `
        <input type='text' [(ngModel)]='value'>
      `
    })
    class Form {
      value = model<string | null>(null, { alias: 'myValueAlias' });
    }

    @Component({
      standalone: true,
      imports: [
        Form
      ],
      template: `
        <jsc-form [(myValueAlias)]='value' />
        <p>{{ value() }}</p>
      `
    })
    class Container {
      value = signal<string>('hello');
    }

    it('should bind model', async () => {
      const { getInputValue } = await render(Container);
      expect(getInputValue()).toBe('hello');
    });

    it('should listen to model', async () => {
      const { setInput, getParagraph } = await render(Container);
      setInput('bye');
      expect(getParagraph()).toBe('bye');
    });

  });

  describe('required', () => {
    @Component({
      standalone: true,
      selector: 'jsc-form',
      imports: [
        FormsModule
      ],
      template: `
        <input type='text' [(ngModel)]='value'>
      `
    })
    class Form {
      value = model.required<string>();
    }

    @Component({
      standalone: true,
      imports: [
        Form
      ],
      template: `
        <jsc-form [(value)]='value' />
        <p>{{ value() }}</p>
      `
    })
    class Container {
      value = signal<string>('hello');
    }

    it('should bind model', async () => {
      const { getInputValue } = await render(Container);
      expect(getInputValue()).toBe('hello');
    });

    it('should listen to model', async () => {
      const { setInput, getParagraph } = await render(Container);
      setInput('bye');
      expect(getParagraph()).toBe('bye');
    });

  });

  async function render(cmpType: Type<unknown>) {
    const { fixture, nativeElement } = createComponent(cmpType);
    await fixture.whenStable();
    return {
      fixture,
      getInputValue() {
        return nativeElement.querySelector('input')?.value;
      },
      setInput(value: string) {
        const inputEl = nativeElement.querySelector('input');
        if (!inputEl) {
          throw new Error('Input element not found');
        }
        inputEl.value = value;
        inputEl.dispatchEvent(new Event('input'));
      },
      getParagraph() {
        return nativeElement.querySelector('p')?.textContent;
      }
    };
  }
});
