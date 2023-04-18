import {
  MonoTypeOperatorFunction,
  Observable,
  OperatorFunction,
  ReplaySubject,
} from 'rxjs';
import { debounce, materialize, scan, startWith } from 'rxjs/operators';

export interface Suspense<T> {
  value: undefined | T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: undefined | any;
  finalized: boolean;
  pending: boolean;
}

/**
 * @description creates a derivated state from the source observable.
 *
 * @example source$.pipe(suspensify())
 *
 * @returns Observable<Suspense<T>>
 */
export function suspensify<T>(): OperatorFunction<T, Suspense<T>> {
  return (source$: Observable<T>): Observable<Suspense<T>> => {
    return source$.pipe(_suspensify(), _coalesceFirstEmittedValue());
  };
}

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

function _suspensify<T>(): OperatorFunction<T, Suspense<T>> {
  return (source$: Observable<T>): Observable<Suspense<T>> => {
    const initialState: Suspense<T> = {
      value: undefined,
      error: undefined,
      finalized: false,
      pending: true,
    };

    return source$.pipe(
      materialize(),
      scan((state = initialState, notification) => {
        /* On complete, merge `finalized: true & pending: false`
         * with the current state. */
        if (notification.kind === 'C') {
          return {
            ...state,
            finalized: true,
            pending: false,
          };
        }

        /* Mark as finalized on error as complete is only triggered on success. */
        const finalized = notification.kind === 'E';

        return {
          value: notification.value,
          error: notification.error,
          finalized,
          pending: false,
        };
      }, initialState),
      startWith(initialState)
    );
  };
}
