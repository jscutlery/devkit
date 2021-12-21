import { BehaviorSubject, map, mapTo, Observable, ReplaySubject } from 'rxjs';
import { ChangeDetectionFns } from './change-detection-fns';

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
  const state$ = new BehaviorSubject<Partial<T>>({});
  let changeDetectionFns: ChangeDetectionFns;

  return (component[_ENGINE_SYMBOL] = {
    destroyed$: destroyed$.asObservable(),
    changed$: state$.pipe(mapTo(undefined)),
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
      return state$.value[property];
    },
    setProperty(property, value) {
      /* Don't set value if it didn't change.
       * This is more performant than `distinctUntilChanged` all over the place. */
      if (state$.value[property] === value) {
        return;
      }

      state$.next({ ...state$.value, [property]: value });
    },
    watchProperty(property) {
      return state$.pipe(map((state) => state[property]));
    },
  });
}

export const _ENGINE_SYMBOL = Symbol('MicrowaveEngine');

export type Microwaved<T, K extends keyof T> = T & {
  [_ENGINE_SYMBOL]?: MicrowaveEngine<T, K>;
};

export interface MicrowaveEngine<T, K extends keyof T> {
  /**
   * Functions below form the strategy facade.
   */
  destroyed$: Observable<void>;
  /* Tells if some property changed. */
  changed$: Observable<void>;
  detach(): void;
  detectChanges(): void;

  /**
   * Functions below are used to bind with component.
   */
  setChangeDetectionFns(changeDetectionFns: ChangeDetectionFns): void;
  markDestroyed(): void;
  getProperty<PROP extends K>(property: PROP): T[PROP] | undefined;
  setProperty<PROP extends K>(property: PROP, value: T[PROP]): void;
  watchProperty<PROP extends K>(
    property: PROP
  ): Observable<T[PROP] | undefined>;
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
