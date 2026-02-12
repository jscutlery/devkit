import { Strategy } from './../src/lib/devkit';
import { Subject } from 'rxjs';
export function createStrategyGlove({
  strategy,
}: {
  strategy: Strategy<unknown>;
}) {
  const initialized$ = new Subject<void>();
  const changed$ = new Subject<void>();
  const destroyed$ = new Subject<void>();
  const detach = jest.fn();
  const detectChanges = jest.fn();
  strategy({
    initialized$,
    changed$,
    destroyed$,
    detach,
    detectChanges,
  });
  const markInitialized = () => {
    initialized$.next();
    initialized$.complete();
  };
  const markChanged = () => changed$.next();
  const markDestroyed = () => {
    destroyed$.next();
    destroyed$.complete();
  };
  return {
    markInitialized,
    markChanged,
    markDestroyed,
    clearMocks() {
      detach.mockClear();
      detectChanges.mockClear();
    },
    detach,
    detectChanges,
  };
}
