import { debounce, startWith, takeUntil } from 'rxjs';
import { Strategy } from '../devkit';

/**
 * A strategy that coalesces changes using micro task scheduling.
 */
export const asapStrategy: Strategy<unknown> = ({
  destroyed$,
  propertyChanges$,
  detectChanges,
  detach,
}) => {
  /**
   * Detach change detection as we want to take control.
   */
  detach();

  /**
   * Trigger change detection initially and on property changes.
   * Coalesce through micro-tasks.
   */
  propertyChanges$
    .pipe(
      startWith(undefined),
      debounce(() => Promise.resolve()),
      takeUntil(destroyed$)
    )
    .subscribe(() => detectChanges());
};
