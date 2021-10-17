import { coalesceWith } from '@rx-angular/cdk/coalescing';
import { concat, defer, Observable, of, OperatorFunction } from 'rxjs';
import { filter, map, materialize } from 'rxjs/operators';

export interface ReportState<T> {
  value: undefined | T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: undefined | any;
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
    const hasProjector = typeof projector === 'function';
    const pending$ = hasProjector
      ? of({ value: undefined, error: undefined, pending: true }).pipe(
          map(projector)
        )
      : of({ value: undefined, error: undefined, pending: true });

    return concat(
      pending$,
      o$.pipe(
        materialize(),
        filter((notification) => notification.kind !== 'C'),
        map((n) =>
          hasProjector
            ? projector({
                value: n.value,
                error: n.error,
                pending: false,
              })
            : {
                value: n.value,
                error: n.error,
                pending: false,
              }
        )
      )
    ).pipe(coalesceWith(defer(() => Promise.resolve())));
  };
}
