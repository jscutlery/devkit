import { ChangeDetectorRef, Type, ɵɵdirectiveInject } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { debounce, distinctUntilChanged, takeUntil } from 'rxjs/operators';

/**
 * @deprecated 🚧 Work in progress.
 */
export function Microwave() {
  return function MicrowaveDecorator<T>(originalClass: Type<T>): Type<T> {
    const microwavedProxy = _decorateClass(
      originalClass as Type<Microwaved<T>>,
      {
        wrapFactory(factoryFn) {
          return _microwave(factoryFn);
        },
        preSet(target, property, value: unknown) {
          const subject = _getOrCreateSubject(target, property);
          // @todo fix this
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          subject.next(value as any);
          target[_MARK_FOR_CHECK_SUBJECT_SYMBOL]?.next();
        },
      }
    );

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
  if (!isMicrowaved(component)) {
    throw new Error(
      `Component is not microwaved. Did you add @Microwave decorator?`
    );
  }

  return _getOrCreateSubject(component, property).pipe(
    distinctUntilChanged(),
    takeUntil(component[_DESTROYED_SUBJECT_SYMBOL])
  );
}

export function isMicrowaved<T>(component: T): component is Microwaved<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (component as any)[_MARK_FOR_CHECK_SUBJECT_SYMBOL] != null;
}

export function _getOrCreateSubject<T, K extends keyof T = keyof T>(
  component: T,
  property: K
): BehaviorSubject<T[K]> {
  const microwaved = component as Microwaved<T>;
  const subjects = microwaved[_SUBJECTS_SYMBOL];

  let subject = subjects?.get(property);
  if (subject == null) {
    /* Use value from component if it is initialized in constructor. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subject = new BehaviorSubject(component[property] as any);
    subjects?.set(property, subject);
  }

  // @todo fix this generic issue.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return subject as any;
}

/**
 * Override component factory and trigger change detection.
 */
export function _microwave<T>(factoryFn: () => Microwaved<T>) {
  /* A subject that regroups change detection requests
   * so we can coalesce and trigger change detection
   * with a custom strategy. */
  const markForCheck$ = new Subject<void>();

  /* Grab change detector to control it. */
  const cdr = ɵɵdirectiveInject(ChangeDetectorRef);
  cdr.detach();

  const target = factoryFn();

  const destroyed$ = new ReplaySubject<void>(1);
  target[_MARK_FOR_CHECK_SUBJECT_SYMBOL] = markForCheck$;
  target[_SUBJECTS_SYMBOL] = new Map();
  target[_DESTROYED_SUBJECT_SYMBOL] = destroyed$;

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
          preSet(target as T, property as K, value);
          return Reflect.set(target, property, value);
        },
      });
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  const originalOnDestroy = MicrowaveProxy.prototype.ngOnDestroy;
  MicrowaveProxy.prototype.ngOnDestroy = function () {
    this[_DESTROYED_SUBJECT_SYMBOL]?.next();
    return originalOnDestroy?.();
  };

  return MicrowaveProxy;
}

export type MicrowaveSubjects<T, K extends keyof T = keyof T> = Map<
  K,
  BehaviorSubject<T[K]>
>;

export const _MARK_FOR_CHECK_SUBJECT_SYMBOL = Symbol(
  'MicrowaveMarkForCheckSubject'
);
export const _SUBJECTS_SYMBOL = Symbol('MicrowaveSubjects');
export const _DESTROYED_SUBJECT_SYMBOL = Symbol('MicrowaveDestroyed');

export type Microwaved<T> = T & {
  [_MARK_FOR_CHECK_SUBJECT_SYMBOL]: Subject<void>;
  [_SUBJECTS_SYMBOL]: MicrowaveSubjects<T>;
  [_DESTROYED_SUBJECT_SYMBOL]: ReplaySubject<void>;
};
