import { ChangeDetectorRef, Type, ɵɵdirectiveInject } from '@angular/core';
import { Subject } from 'rxjs';
import { debounce } from 'rxjs/operators';

/**
 * @deprecated 🚧 Work in progress.
 */
export function Microwave() {
  return function MicrowaveDecorator<T>(originalClass: Type<T>): Type<T> {
    const compiledClass = originalClass as CompiledComponentType<T>;

    const ReactiveProxyClass: Type<T> = function (this: T, ...args: unknown[]) {
      const factoryFn = _decorateFactory(() =>
        Reflect.construct(originalClass, args, ReactiveProxyClass)
      );

      return factoryFn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    ReactiveProxyClass.prototype = new Proxy(compiledClass.prototype, {
      set(target, property, value) {
        return Reflect.set(target, property, value);
      },
    });

    return ReactiveProxyClass;
  };
}

/**
 * @deprecated 🚧 Work in progress.
 */
export function watch() {
  throw new Error('🚧 Work in progress!');
}

/**
 * Override component factory and trigger change detection.
 */
export function _decorateFactory<T>(factoryFn: () => T) {
  return () => {
    /* A subject that regroups change detection requests
     * so we can coalesce and trigger change detection
     * with a custom strategy. */
    const markForCheck$ = new Subject<void>();

    /* Grab change detector to control it. */
    const cdr = ɵɵdirectiveInject(ChangeDetectorRef);

    /* @todo unsubscribe on destroy. */
    markForCheck$
      .pipe(debounce(() => Promise.resolve()))
      .subscribe(() => cdr.detectChanges());

    cdr.detach();
    markForCheck$.next();

    const instance = factoryFn();

    return instance;
  };
}

export type CompiledComponentType<T> = Type<T> & { ɵfac: () => T };
