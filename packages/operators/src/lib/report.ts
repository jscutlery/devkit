import { Observable, OperatorFunction } from 'rxjs';
import { map, materialize, scan, startWith } from 'rxjs/operators';

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
  return (o$: Observable<T>): Observable<R | ReportState<T>> => {
    const initialState = {
      value: undefined,
      error: undefined,
      finalized: false,
      pending: true,
    };

    const result$ = o$.pipe(
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
