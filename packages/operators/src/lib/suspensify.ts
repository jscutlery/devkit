import {
  MonoTypeOperatorFunction,
  Observable,
  ObservableNotification,
  OperatorFunction,
  ReplaySubject,
} from 'rxjs';
import { debounce, map, materialize, scan, startWith } from 'rxjs/operators';

export interface SuspenseLax<T> {
  finalized: boolean;
  hasError: boolean;
  hasValue: boolean;
  pending: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: undefined | any;
  value: undefined | T;
}

export interface SuspensePending {
  finalized: false;
  hasError: false;
  hasValue: false;
  pending: true;
}

export interface SuspenseWithValue<T> {
  finalized: boolean;
  hasError: false;
  hasValue: true;
  pending: false;
  value: T;
}

export interface SuspenseWithError {
  finalized: true;
  hasError: true;
  hasValue: false;
  pending: false;
  error: unknown;
}

export interface SuspenseEmpty {
  finalized: true;
  hasError: false;
  hasValue: false;
  pending: false;
}

export type Suspense<T> =
  | SuspensePending
  | SuspenseWithValue<T>
  | SuspenseWithError
  | SuspenseEmpty;

export interface SuspensifyOptions {
  strict?: boolean;
}

/**
 * @description creates a derivated state from the source observable.
 *
 * @example source$.pipe(suspensify())
 *
 * @returns Observable<SuspenseLax<T> | SuspenseStrict<T>>
 */
export function suspensify<T>(options: {
  strict: false;
}): OperatorFunction<T, SuspenseLax<T>>;
export function suspensify<T>(options?: {
  strict: true;
}): OperatorFunction<T, Suspense<T>>;
export function suspensify<T>({
  strict = true,
}: SuspensifyOptions = {}): OperatorFunction<T, SuspenseLax<T> | Suspense<T>> {
  return (source$: Observable<T>): Observable<Suspense<T>> => {
    const strictSuspense$ = source$.pipe(
      _suspensify(),
      _coalesceFirstEmittedValue()
    );
    return strict
      ? strictSuspense$
      : (strictSuspense$.pipe(
          map((strictSuspense) => ({
            error: undefined,
            value: undefined,
            ...strictSuspense,
          }))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as any);
  };
}

/**
 * This is the initial state of the Suspense.
 * It is exposed for convenience and edge cases where the initial state must be set initially.
 * e.g. when using {@link suspensify} on inner observables.
 * @example toSignal(source$.pipe(switchMap(() => fetchData().pipe(suspensify()))), {initialValue: pending});
 */
export const pending: SuspensePending = {
  finalized: false,
  hasError: false,
  hasValue: false,
  pending: true,
};

function _coalesceFirstEmittedValue<T>(): MonoTypeOperatorFunction<T> {
  return (source$: Observable<T>): Observable<T> => {
    return new Observable<T>((observer) => {
      const isReadySubject = new ReplaySubject<unknown>(1);

      const subscription = source$
        .pipe(
          /* Wait for all synchronous processing to be done. */
          debounce(() => isReadySubject)
        )
        .subscribe(observer);

      /* Sync emitted values have been processed now.
       * Mark source as ready and emit last computed state. */
      isReadySubject.next(undefined);

      return () => subscription.unsubscribe();
    });
  };
}

/* Use values as types for better type checking. */
const TRUE = true as const;
const FALSE = false as const;

function _suspensify<T>(): OperatorFunction<T, Suspense<T>> {
  return (source$: Observable<T>): Observable<Suspense<T>> => {
    return source$.pipe(
      materialize(),
      scan<ObservableNotification<T>, Suspense<T>>((state, notification) => {
        switch (notification.kind) {
          /* Value. */
          case 'N':
            return {
              finalized: FALSE,
              hasError: FALSE,
              hasValue: TRUE,
              value: notification.value,
              pending: FALSE,
            };
          /* Error. */
          case 'E':
            return {
              finalized: TRUE,
              hasError: TRUE,
              hasValue: FALSE,
              pending: FALSE,
              error: notification.error,
            };
          /* Complete. */
          case 'C':
            return {
              ...state,
              finalized: TRUE,
              pending: FALSE,
            };
        }
      }, pending),
      startWith(pending)
    );
  };
}
