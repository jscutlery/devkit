import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

export const _MARK_FOR_CHECK_SUBJECT_SYMBOL = Symbol(
  'MicrowaveMarkForCheckSubject'
);
export const _SUBJECTS_SYMBOL = Symbol('MicrowaveSubjects');
export const _DESTROYED_SUBJECT_SYMBOL = Symbol('MicrowaveDestroyed');

export type MicrowaveSubjects<T, K extends keyof T = keyof T> = Map<
  K,
  BehaviorSubject<T[K]>
>;

export type Microwaved<T> = T & {
  [_MARK_FOR_CHECK_SUBJECT_SYMBOL]?: Subject<void>;
  [_SUBJECTS_SYMBOL]?: MicrowaveSubjects<T>;
  [_DESTROYED_SUBJECT_SYMBOL]?: ReplaySubject<void>;
};

export function isMicrowaved<T>(component: T): component is Microwaved<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return _MARK_FOR_CHECK_SUBJECT_SYMBOL in component;
}

export function emitPropertyChange<T, K extends keyof T = keyof T>(
  component: T,
  property: K,
  value: T[K]
) {
  getPropertySubject(component, property).next(value);
}

export function markForCheck<T>(component: Microwaved<T>) {
  getMarkForCheckSubject(component).next();
}

export function markDestroyed<T>(component: Microwaved<T>) {
  getDestroyedSubject(component).next();
}

export function getDestroyedSubject<T>(component: Microwaved<T>) {
  return (component[_DESTROYED_SUBJECT_SYMBOL] =
    component[_DESTROYED_SUBJECT_SYMBOL] ?? new ReplaySubject(1));
}

/**
 * @returns a subject that regroups change detection requests
 * so we can coalesce and trigger change detection
 * with a custom strategy.
 */
export function getMarkForCheckSubject<T>(component: Microwaved<T>) {
  return (component[_MARK_FOR_CHECK_SUBJECT_SYMBOL] =
    component[_MARK_FOR_CHECK_SUBJECT_SYMBOL] ?? new Subject());
}

export function getPropertySubject<T, K extends keyof T = keyof T>(
  component: Microwaved<T>,
  property: K
): BehaviorSubject<T[K]> {
  const subjectsMap = _getPropertySubjectsMap(component);
  let subject = subjectsMap?.get(property);
  if (subject == null) {
    /* Use value from component if it is initialized in constructor. */
    subject = new BehaviorSubject(component[property]);
    subjectsMap?.set(property, subject);
  }

  return subject;
}

export function _getPropertySubjectsMap<T>(component: Microwaved<T>) {
  return (component[_SUBJECTS_SYMBOL] =
    component[_SUBJECTS_SYMBOL] ?? new Map());
}
