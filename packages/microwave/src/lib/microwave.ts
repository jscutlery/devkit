import { ChangeDetectorRef, Type, ɵɵdirectiveInject } from '@angular/core';
import { noop, Observable } from 'rxjs';
import { debounce, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { __decorate } from 'tslib';
import {
  emitPropertyChange,
  getDestroyedSubject,
  getMarkForCheckSubject,
  getPropertySubject,
  getPropertyValue,
  markDestroyed,
  markForCheck,
  Microwaved,
} from './internals';

/**
 * @deprecated 🚧 Work in progress.
 */
export function Microwave() {
  return function MicrowaveDecorator<T>(originalClass: IvyComponentType<T>) {
    _decorateClass(originalClass, {
      wrapFactory: (factoryFn) => _microwave(factoryFn),
      preSet(target, property, value) {
        emitPropertyChange(target, property, value);
        markForCheck(target);
      },
    });
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
  originalClass: IvyComponentType<T>,
  {
    wrapFactory,
    preSet,
  }: {
    wrapFactory: (factoryFn: () => T) => T;
    preSet: (target: T, property: K, value: V) => void;
  }
) {
  if (!originalClass.ɵfac || !originalClass.ɵcmp) {
    throw new Error(
      `${originalClass.name} is either not a component or not compiled.`
    );
  }

  /**
   * Override component factory.
   */
  const factory = __decorate(
    [
      /*
       * Override getters & setters.
       */
      (factoryFn: () => T) => () => {
        const instance = factoryFn() as Microwaved<T>;

        for (const property of Object.getOwnPropertyNames(
          instance
        ) as Array<K>) {
          /* Set initial value. */
          emitPropertyChange(instance, property, instance[property]);

          Object.defineProperty(instance, property, {
            set(value) {
              preSet(instance, property, value);
              emitPropertyChange(instance, property, value);
            },
            get() {
              return getPropertyValue(instance, property);
            },
          });
        }

        return instance;
      },

      /*
       * Use given wrapper.
       */
      (factoryFn: () => T) => () => wrapFactory(factoryFn),
    ],
    originalClass.ɵfac
  );

  Object.defineProperty(originalClass, 'ɵfac', {
    get() {
      return factory;
    },
  });

  /**
   * Override ngOnDestroy.
   */
  originalClass.prototype.ngOnDestroy = __decorate(
    [
      (onDestroy: () => void) => {
        return function (this: T) {
          console.log('destroy');

          markDestroyed(this);
          return onDestroy?.();
        };
      },
    ],
    /* @hack use noop, otherwise, __decorate will not decorate the function. */
    originalClass.prototype.ngOnDestroy ?? noop
  );
}

export interface IvyComponentType<T> extends Type<T> {
  ɵcmp?: {
    factory: () => T;
  };
  ɵfac?: () => T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function _wrap<F extends (...args: any[]) => any>(
  fn: F,
  wrapper: (fn: F) => ReturnType<F>
) {
  return () => wrapper(fn);
}
