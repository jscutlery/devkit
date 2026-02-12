import { concat, MonoTypeOperatorFunction, takeUntil } from 'rxjs';
import { Strategy } from '../devkit';
/**
 * Creates a change detection strategy which is local to the component.
 * It implements optional coalescing which can be customized using `coalescer` parameter.
 *
 * @example createLocalStrategy()
 * @example createLocalStrategy({coalescer: audit(() => Promise.resolve())})
 *
 * @returns a strategy that can be used with Microwave decorator.
 */
export const createLocalStrategy =
  ({
    coalescer,
  }: {
    coalescer?: MonoTypeOperatorFunction<void>;
  } = {}): Strategy<unknown> =>
  ({ initialized$, changed$, destroyed$, detach, detectChanges }) => {
    /**
     * Detach change detection as we want to take control.
     */
    detach();
    /**
     * Trigger change detection initially and on property changes.
     * Coalesce through micro-tasks.
     */
    let source$ = concat(initialized$, changed$);
    if (coalescer != null) {
      source$ = source$.pipe(coalescer);
    }
    source$.pipe(takeUntil(destroyed$)).subscribe(() => detectChanges());
  };
