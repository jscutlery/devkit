import { BehaviorSubject, ReplaySubject, Subject, Observable } from 'rxjs';

/**
 * This should stay decoupled from Angular.
 *
 * @param component an instance of anything
 * @returns an set of methods and observables that respectively
 * control and represent the state of the object.
 */
export function getEngine<T>(component: Microwaved<T>): Engine<T> {
  const destroyed$ = _getDestroyedSubject(component);
  const propertyChanges$ = _getPropertyChangesSubject(component);

  return {
    destroyed$: destroyed$.asObservable(),
    propertyChanges$: propertyChanges$.asObservable(),
    markDestroyed() {
      destroyed$.next();
    },
    getProperty(property) {
      return _getPropertySubject(component, property).value;
    },
    setProperty(property, value) {
      _getPropertySubject(component, property).next(value);
      _getPropertyChangesSubject(component).next({ property, value });
    },
    watchProperty(property) {
      return _getPropertySubject(component, property);
    },
  };
}

export interface Engine<T, K extends keyof T = keyof T> {
  destroyed$: Observable<void>;
  propertyChanges$: Observable<{ property: K; value: T[K] }>;
  markDestroyed(): void;
  getProperty<PROP extends keyof T = keyof T>(property: PROP): T[PROP];
  setProperty<PROP extends keyof T = keyof T>(
    property: PROP,
    value: T[PROP]
  ): void;
  watchProperty<PROP extends keyof T = keyof T>(
    property: PROP
  ): Observable<T[PROP]>;
}

export const _PROPERTY_CHANGES_SUBJECT_SYMBOL = Symbol(
  'MicrowavePropertyChanges'
);
export const _SUBJECTS_SYMBOL = Symbol('MicrowaveSubjects');
export const _DESTROYED_SUBJECT_SYMBOL = Symbol('MicrowaveDestroyed');

export type MicrowaveSubjects<T, K extends keyof T = keyof T> = Map<
  K,
  BehaviorSubject<T[K]>
>;

export type Microwaved<T, K extends keyof T = keyof T> = T & {
  [_PROPERTY_CHANGES_SUBJECT_SYMBOL]?: Subject<{ property: K; value: T[K] }>;
  [_SUBJECTS_SYMBOL]?: MicrowaveSubjects<T>;
  [_DESTROYED_SUBJECT_SYMBOL]?: ReplaySubject<void>;
};

export function _getDestroyedSubject<T>(component: Microwaved<T>) {
  return (component[_DESTROYED_SUBJECT_SYMBOL] =
    component[_DESTROYED_SUBJECT_SYMBOL] ?? new ReplaySubject(1));
}

/**
 * @returns a subject that regroups change detection requests
 * so we can coalesce and trigger change detection
 * with a custom strategy.
 */
export function _getPropertyChangesSubject<T>(component: Microwaved<T>) {
  return (component[_PROPERTY_CHANGES_SUBJECT_SYMBOL] =
    component[_PROPERTY_CHANGES_SUBJECT_SYMBOL] ?? new Subject());
}

export function _getPropertySubject<T, K extends keyof T = keyof T>(
  component: Microwaved<T>,
  property: K
): BehaviorSubject<T[K]> {
  const subjectsMap = _getPropertySubjectsMap(component);
  let subject = subjectsMap?.get(property);
  if (subject == null) {
    /* Use value from component if it is initialized in constructor. */
    subject = new BehaviorSubject(undefined);
    subjectsMap?.set(property, subject);
  }

  return subject;
}

export function _getPropertySubjectsMap<T>(component: Microwaved<T>) {
  return (component[_SUBJECTS_SYMBOL] =
    component[_SUBJECTS_SYMBOL] ?? new Map());
}
