import { ChangeDetectionFns } from './change-detection-fns';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';

/**
 * This should stay decoupled from Angular.
 *
 * @param component an instance of anything
 * @returns an set of methods and observables that respectively
 * control and represent the state of the object.
 */
export function getEngine<T, K extends keyof T = keyof T>(
  component: Microwaved<T, K>
): MicrowaveEngine<T, K> {
  /* Memoize engine. */
  const engine = component[_ENGINE_SYMBOL];
  if (engine != null) {
    return engine;
  }

  const destroyed$ = new ReplaySubject<void>(1);
  const propertyChanges$ = new Subject<{ property: K; value: T[K] }>();
  const subjectsMap: MicrowaveSubjectsMap<T, K> = new Map();
  let changeDetectionFns: ChangeDetectionFns;

  return (component[_ENGINE_SYMBOL] = {
    destroyed$: destroyed$.asObservable(),
    propertyChanges$: propertyChanges$.asObservable(),
    detach() {
      changeDetectionFns.detach();
    },
    detectChanges() {
      changeDetectionFns.detectChanges();
    },
    markDestroyed() {
      destroyed$.next();
    },
    setChangeDetectionFns(_changeDetectionFns: ChangeDetectionFns) {
      changeDetectionFns = _changeDetectionFns;
    },
    getProperty(property) {
      return _getPropertySubject(subjectsMap, property).value;
    },
    setProperty(property, value) {
      _getPropertySubject(subjectsMap, property).next(value);
      propertyChanges$.next({ property, value });
    },
    watchProperty(property) {
      return _getPropertySubject(subjectsMap, property).asObservable();
    },
  });
}

export function getStrategyDevKit<T, K extends keyof T = keyof T>(
  component: Microwaved<T, K>
): StrategyDevKit<T, K> {
  const { destroyed$, propertyChanges$, detach, detectChanges, markDestroyed } =
    getEngine(component);
  return { destroyed$, propertyChanges$, detach, detectChanges, markDestroyed };
}

export const _ENGINE_SYMBOL = Symbol('MicrowaveEngine');

export type Microwaved<T, K extends keyof T> = T & {
  [_ENGINE_SYMBOL]?: MicrowaveEngine<T, K>;
};

/**
 * Functions below form the strategy facade.
 */
export interface StrategyDevKit<T, K extends keyof T = keyof T> {
  destroyed$: Observable<void>;
  propertyChanges$: Observable<{ property: K; value: T[K] }>;
  detach(): void;
  detectChanges(): void;
  markDestroyed(): void;
}

/**
 * Functions below are used to bind with component.
 */
export interface MicrowaveEngine<T, K extends keyof T>
  extends StrategyDevKit<T, K> {
  setChangeDetectionFns(changeDetectionFns: ChangeDetectionFns): void;
  getProperty<PROP extends K>(property: PROP): T[PROP];
  setProperty<PROP extends K>(property: PROP, value: T[PROP]): void;
  watchProperty<PROP extends K>(property: PROP): Observable<T[PROP]>;
}

export type MicrowaveSubjectsMap<T, K extends keyof T> = Map<
  K,
  BehaviorSubject<T[K]>
>;

export function _getPropertySubject<T, K extends keyof T, PROP extends K>(
  subjectsMap: MicrowaveSubjectsMap<T, K>,
  property: PROP
): BehaviorSubject<T[PROP]> {
  let subject = subjectsMap.get(property);

  if (subject == null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subject = new BehaviorSubject(undefined as any);
    subjectsMap.set(property, subject);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return subject as any;
}
