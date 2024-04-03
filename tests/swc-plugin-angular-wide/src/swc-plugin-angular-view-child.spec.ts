/* eslint-disable @angular-eslint/component-class-suffix */

import { Component, ElementRef, Type, viewChild } from '@angular/core';
import { createComponent } from './testing';

describe('swc-plugin-angular: view child', () => {
  it('should match view child without read option', () => {

    @Component({
      standalone: true,
      template: `
        <h1 #title>Hello view child!</h1>
        <p>{{ paragraph() }}</p>
      `
    })
    class Container {
      titleEl = viewChild<ElementRef<HTMLHeadingElement>>('title');
      paragraph = () => this.titleEl()?.nativeElement.textContent;
    }

    const { paragraph } = render(Container);
    expect(paragraph).toBe('Hello view child!');
  });

  it('should match view child with read option', () => {

    @Component({
      standalone: true,
      selector: 'jsc-title',
      template: `<h1>{{ title }}</h1>`
    })
    class Title {
      title = 'Hello view child with read option!';
    }

    @Component({
      standalone: true,
      imports: [Title],
      template: `
        <jsc-title #title />
        <p>{{ paragraph() }}</p>
      `
    })
    class Container {
      titleEl = viewChild('title', { read: Title });
      paragraph = () => this.titleEl()?.title;
    }

    const { paragraph } = render(Container);
    expect(paragraph).toBe('Hello view child with read option!');
  });

  it('should match required view child', () => {
    @Component({
      standalone: true,
      template: `
        <h1 #title>Hello required view child!</h1>
        <p>{{ paragraph() }}</p>
      `
    })
    class Container {
      titleEl = viewChild.required('title', { read: ElementRef<HTMLHeadingElement> });
      paragraph = () => this.titleEl().nativeElement.textContent;
    }

    const { paragraph } = render(Container);
    expect(paragraph).toBe('Hello required view child!');
  });

  it('should match view child with provider', () => {
    @Component({
      standalone: true,
      selector: 'jsc-title',
      template: `<h1>{{ title }}</h1>`
    })
    class Title {
      title = 'Hello view child with provider!';
    }

    @Component({
      standalone: true,
      imports: [Title],
      template: `
        <jsc-title #title />
        <p>{{ paragraph() }}</p>
      `
    })
    class Container {
      titleEl = viewChild(Title);
      paragraph = () => this.titleEl()?.title;
    }

    const { paragraph } = render(Container);
    expect(paragraph).toBe('Hello view child with provider!');
  });

  function render(cmpType: Type<unknown>) {
    const { nativeElement } = createComponent(cmpType);
    return {
      paragraph: nativeElement.querySelector('p')?.textContent
    };
  }
});
