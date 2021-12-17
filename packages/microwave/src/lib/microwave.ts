import { ChangeDetectorRef, Type, ɵɵdirectiveInject } from '@angular/core';
import { Subject } from 'rxjs';
import { debounce } from 'rxjs/operators';

/**
 * @deprecated 🚧 Work in progress.
 */
export function Microwave() {
  return function MicrowaveDecorator<T>(originalClass: Type<T>): Type<T> {
    const microwavedClass: Type<Microwaved<T>> = originalClass;

    return _decorateClass(microwavedClass, {
      wrapFactory(factoryFn) {
        const { markForCheck$ } = _setupMicrowave();

        const target = factoryFn();

        target[_MARK_FOR_CHECK_SUBJECT_SYMBOL] = markForCheck$;

        return target;
      },
      preSet(target) {
        target[_MARK_FOR_CHECK_SUBJECT_SYMBOL]?.next();
      },
    });
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
export function _setupMicrowave() {
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

  return { markForCheck$ };
}

export function _decorateClass<
  T extends Record<string | symbol, unknown>,
  K extends string | symbol
>(
  originalClass: Type<T>,
  {
    wrapFactory,
    preSet,
  }: {
    wrapFactory: (factoryFn: () => T) => T;
    preSet: (target: T) => void;
  }
) {
  const MicrowaveProxy: Type<T> = function (this: T, ...args: unknown[]) {
    return wrapFactory(() =>
      Reflect.construct(originalClass, args, MicrowaveProxy)
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  MicrowaveProxy.prototype = new Proxy(originalClass.prototype, {
    set(target, property, value) {
      preSet(target as T);
      return Reflect.set(target, property, value);
    },
  });

  return MicrowaveProxy;
}

export const _MARK_FOR_CHECK_SUBJECT_SYMBOL = Symbol('MarkForCheckSubject');

export type Microwaved<T> = T & {
  [_MARK_FOR_CHECK_SUBJECT_SYMBOL]?: Subject<void>;
};
