import { debounce, takeUntil } from 'rxjs';
import { Strategy } from '../devkit';

/**
 * A strategy that coalesces changes using micro task scheduling.
 */
export const asapStrategy: Strategy<unknown> = ({
  destroyed$,
  changed$,
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
  changed$
    .pipe(
      debounce(() => Promise.resolve()),
      takeUntil(destroyed$)
    )
    .subscribe(() => detectChanges());
};
