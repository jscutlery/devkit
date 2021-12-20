import { ChangeDetectorRef, Type, ɵɵdirectiveInject } from '@angular/core';
import { Observable } from 'rxjs';
import { debounce, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import {
  emitPropertyChange,
  getDestroyedSubject,
  getMarkForCheckSubject,
  getPropertySubject,
  markDestroyed,
  markForCheck,
  Microwaved,
} from './internals';

/**
 * @deprecated 🚧 Work in progress.
 */
export function Microwave() {
  return function MicrowaveDecorator<T>(originalClass: Type<T>): Type<T> {
    const microwavedProxy = _decorateClass(originalClass as Type<T>, {
      wrapFactory(factoryFn) {
        return _microwave(factoryFn);
      },
      preSet(target, property, value) {
        emitPropertyChange(target, property, value);
        markForCheck(target);
      },
    });

    /* Copy static properties. */
    Object.assign(microwavedProxy, originalClass);

    return microwavedProxy;
  };
}

/**
 * @deprecated 🚧 Work in progress.
 */
export function watch<T, K extends keyof T = keyof T>(
  component: T,
  property: K
): Observable<T[K]> {
  return getPropertySubject(component, property).pipe(
    distinctUntilChanged(),
    takeUntil(getDestroyedSubject(component))
  );
}

/**
 * Override component factory and trigger change detection.
 */
export function _microwave<T>(factoryFn: () => Microwaved<T>) {
  /* Grab change detector to control it. */
  const cdr = ɵɵdirectiveInject(ChangeDetectorRef);
  cdr.detach();

  const target = factoryFn();

  const destroyed$ = getDestroyedSubject(target);
  const markForCheck$ = getMarkForCheckSubject(target);

  markForCheck$
    .pipe(
      debounce(() => Promise.resolve()),
      takeUntil(destroyed$)
    )
    .subscribe(() => cdr.detectChanges());

  markForCheck$.next();

  return target;
}

export function _decorateClass<
  T,
  K extends keyof T = keyof T,
  V extends T[K] = T[K]
>(
  originalClass: Type<T>,
  {
    wrapFactory,
    preSet,
  }: {
    wrapFactory: (factoryFn: () => T) => T;
    preSet: (target: T, property: K, value: V) => void;
  }
) {
  const MicrowaveProxy: Type<T> = function (this: T, ...args: unknown[]) {
    return wrapFactory(() => {
      const instance = Reflect.construct(originalClass, args, MicrowaveProxy);
      return new Proxy(instance, {
        set(target, property, value) {
          preSet(target as T, property as K, value as V);
          return Reflect.set(target, property, value);
        },
      });
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  const originalOnDestroy = MicrowaveProxy.prototype.ngOnDestroy;
  MicrowaveProxy.prototype.ngOnDestroy = function () {
    markDestroyed(this);
    return originalOnDestroy?.();
  };

  return MicrowaveProxy;
}
