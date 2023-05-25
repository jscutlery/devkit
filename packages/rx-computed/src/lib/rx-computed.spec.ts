import {
  Component,
  EnvironmentInjector,
  Injector,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NEVER, Observable, of, Subject, throwError } from 'rxjs';
import { rxComputed } from './rx-computed';

describe(rxComputed.name, () => {
  it('should return undefined as default initial value', () => {
    const { rxComputed } = setUp();

    const signal = rxComputed(() => NEVER);

    expect(signal()).toBeUndefined();
  });

  it('should return custom initial value', () => {
    const { rxComputed } = setUp();

    const signal = rxComputed(() => NEVER, { initialValue: null });

    expect(signal()).toBeNull();
  });

  it('should return emitted sync value', () => {
    const { rxComputed } = setUp();

    const signal = rxComputed(() => of(42));

    expect(signal()).toBe(42);
  });

  it('should return emitted async value', () => {
    const { rxComputed } = setUp();

    const subject = new Subject<number>();

    const signal = rxComputed(() => subject);

    subject.next(42);

    expect(signal()).toBe(42);
  });

  it('should throw error when observable throws error', () => {
    const { rxComputed } = setUp();

    const signal = rxComputed(() => throwError(() => new Error('💥 Oups!')));

    expect(() => signal()).toThrow('💥 Oups!');
  });

  it('should unsubscribe when dependency changes', () => {
    const { rxComputed, flushEffects } = setUp();
    const unsubscribe = jest.fn();

    const value = signal(0);

    rxComputed(
      () =>
        new Observable((observer) => {
          observer.next(value() * 2);
          return unsubscribe;
        })
    );

    /* Update dependency and flush effects... */
    value.set(1);
    flushEffects();

    /* ... and make sure that observable tear down is called. */
    expect(unsubscribe).toBeCalled();
  });

  describe('injector', () => {
    it('should throw when invoked without injector', () => {
      const { rxComputedNoInjector } = setUp();
      expect(() => rxComputedNoInjector(() => NEVER)).toThrow(
        /rxComputed\(\) can only be used within an injection context/
      );
    });

    it('should be able to use a custom Injector', () => {
      const { rxComputedNoInjector } = setUp();

      const envInjector = TestBed.inject(EnvironmentInjector);

      const signal = rxComputedNoInjector(() => of(42), {
        injector: envInjector,
      });
      expect(signal()).toEqual(42);
    });
  });

  function setUp() {
    const injector = TestBed.inject(Injector);

    @Component({
      template: '',
      standalone: true,
    })
    class MyComponent {}

    const fixture = TestBed.createComponent(MyComponent);

    /* Inspiration: https://github.com/angular/angular/blob/06b498f67f2ad16bb465ef378bdb16da84e41a1c/packages/core/rxjs-interop/test/to_observable_spec.ts#LL30C25-L30C25 */
    const flushEffects = () => fixture.detectChanges();

    return {
      flushEffects,
      rxComputed<T>(...args: Parameters<typeof rxComputed<T>>) {
        const signal = runInInjectionContext(injector, () =>
          rxComputed(...args)
        );

        flushEffects();

        return signal;
      },
      rxComputedNoInjector<T>(...args: Parameters<typeof rxComputed<T>>) {
        const signal = rxComputed(...args);

        flushEffects();

        return signal;
      },
    };
  }
});
