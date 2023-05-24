import { Component, Injector, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NEVER, Observable, of } from 'rxjs';
import { rxComputed } from './rx-computed';

describe(rxComputed.name, () => {

  it('should return undefined as default initial value', () => {
    const { rxComputed, flushEffects } = setUp();

    const signal = rxComputed(() => NEVER);

    flushEffects();

    expect(signal()).toBeUndefined();
  });

  it.todo('should return custom initial value')

  it('should return emitted sync value', () => {
    const { rxComputed, flushEffects } = setUp();

    const signal = rxComputed(() => of(42));

    flushEffects();

    expect(signal()).toBe(42);
  });

  it.todo('should return emitted async value');

  it.todo('should throw error');

  it.todo('should throw unsubscribe when dependency changes');

  function setUp() {
    const injector = TestBed.inject(Injector);

    @Component({
      template: '',
      standalone: true,
    })
    class MyComponent {
    }

    const fixture = TestBed.createComponent(MyComponent);

    return {
      /* Inspiration: https://github.com/angular/angular/blob/06b498f67f2ad16bb465ef378bdb16da84e41a1c/packages/core/rxjs-interop/test/to_observable_spec.ts#LL30C25-L30C25 */
      flushEffects() {
        fixture.detectChanges();
      },
      rxComputed<T>(fn: () => Observable<T>) {
        return runInInjectionContext(injector, () => rxComputed(fn));
      }
    };
  }

});
