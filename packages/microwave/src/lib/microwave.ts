import { ChangeDetectorRef, Type, ɵɵdirectiveInject } from '@angular/core';
import {
  noop,
  Observable,
  debounce,
  distinctUntilChanged,
  startWith,
  takeUntil,
} from 'rxjs';
import { __decorate } from 'tslib';
import { getEngine, Microwaved } from './engine';

/**
 * @deprecated 🚧 Work in progress.
 */
export function Microwave() {
  return function MicrowaveDecorator<T>(originalClass: IvyComponentType<T>) {
    _decorateClass(originalClass, {
      wrapFactory: (factoryFn) => _microwave(factoryFn),
      preSet(target, property, value) {
        getEngine(target).setProperty(property, value);
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
  const { destroyed$, watchProperty } = getEngine(component);
  return watchProperty(property).pipe(
    distinctUntilChanged(),
    takeUntil(destroyed$)
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

  const { destroyed$, propertyChanges$ } = getEngine(target);

  propertyChanges$
    .pipe(
      startWith(undefined),
      debounce(() => Promise.resolve()),
      takeUntil(destroyed$)
    )
    .subscribe(() => cdr.detectChanges());

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
  if (!originalClass.ɵfac) {
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
        const engine = getEngine(instance);

        for (const property of Object.getOwnPropertyNames(
          instance
        ) as Array<K>) {
          /* Set initial value. */
          engine.setProperty(property, instance[property]);

          Object.defineProperty(instance, property, {
            set(value) {
              preSet(instance, property, value);
              engine.setProperty(property, value);
            },
            get() {
              return engine.getPropertyValue(property);
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
          getEngine(this).markDestroyed();
          return onDestroy?.();
        };
      },
    ],
    /* @hack use noop, otherwise, __decorate will not decorate the function. */
    originalClass.prototype.ngOnDestroy ?? noop
  );
}

export interface IvyComponentType<T> extends Type<T> {
  ɵfac?: () => T;
}
