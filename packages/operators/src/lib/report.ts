import {
  Observable,
  OperatorFunction,
  ReplaySubject,
  Subject,
  Subscription,
} from 'rxjs';
import {
  debounce,
  map,
  materialize,
  scan,
  startWith,
  tap,
} from 'rxjs/operators';

export interface ReportState<T> {
  value: undefined | T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: undefined | any;
  finalized: boolean;
  pending: boolean;
}

export function report<T, R = ReportState<T>>(): OperatorFunction<T, R>;
export function report<T, R>(
  projector: (data: ReportState<T>) => R
): OperatorFunction<T, R>;
export function report<T, R = ReportState<T>>(
  projector?: (data: ReportState<T>) => R
): OperatorFunction<T, R | ReportState<T>> {
  return (source$: Observable<T>): Observable<R | ReportState<T>> => {
    return new Observable((observer) => {
      const isReadySubject = new ReplaySubject<unknown>(1);

      const subscription = source$
        .pipe(
          _report(projector),
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

function _report<T, R = ReportState<T>>(): OperatorFunction<T, R>;
function _report<T, R>(
  projector: (data: ReportState<T>) => R
): OperatorFunction<T, R>;
function _report<T, R = ReportState<T>>(
  projector?: (data: ReportState<T>) => R
): OperatorFunction<T, R | ReportState<T>> {
  return (source$: Observable<T>): Observable<R | ReportState<T>> => {
    const initialState = {
      value: undefined,
      error: undefined,
      finalized: false,
      pending: true,
    };

    const result$ = source$.pipe(
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
      }, undefined),
      startWith(initialState)
    );

    return projector != null ? result$.pipe(map(projector)) : result$;
  };
}
