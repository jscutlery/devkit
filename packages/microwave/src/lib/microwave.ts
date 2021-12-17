import { Type, ɵɵdirectiveInject, ChangeDetectorRef } from '@angular/core';
import { __decorate } from 'tslib';

/**
 * @deprecated 🚧 Work in progress.
 */
export function Microwave() {
  return function MicrowaveDecorator<T>(originalClass: Type<T>): Type<T> {
    const compiledClass = originalClass as CompiledComponentType<T>;

    _overrideGetterValue(compiledClass, 'ɵfac', _decorateComponentFactory);

    return compiledClass;
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
export function _decorateComponentFactory<T>(factoryFn: () => T) {
  return () => {
    const instance = factoryFn();

    const cdr = ɵɵdirectiveInject(ChangeDetectorRef);
    cdr.detach();

    return instance;
  };
}

export function _overrideGetterValue<
  T,
  K extends keyof T,
  VALUE extends T[K],
  GETTER extends () => VALUE
>(object: T, property: K, decorator: (value: VALUE) => VALUE) {
  const getter: GETTER =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.getOwnPropertyDescriptor(object, property)?.get as any;

  Object.defineProperty(object, property, {
    get() {
      return decorator(getter());
    },
  });
}

export type CompiledComponentType<T> = Type<T> & { ɵfac: () => T };
