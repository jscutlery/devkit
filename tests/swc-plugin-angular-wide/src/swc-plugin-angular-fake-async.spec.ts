/* eslint-disable @angular-eslint/component-class-suffix */

import { Component, OnInit, signal } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { createComponent } from './testing';

describe('swc-plugin-angular: fakeAsync and tick', () => {
  it('should render with fakeAsync and tick', fakeAsync(() => {
    @Component({
      standalone: true,
      template: '<h1>Value: {{ value() }}</h1>',
    })
    class Container implements OnInit {
      value = signal(0);

      ngOnInit() {
        setTimeout(() => {
          this.value.set(1);
        }, 1000);
      }
    }

    const { nativeElement } = createComponent(Container);
    const heading = () => nativeElement.querySelector('h1')?.textContent;

    expect(heading()).toBe('Value: 0');

    tick(1000);
    expect(heading()).toBe('Value: 1');
  }));
});
