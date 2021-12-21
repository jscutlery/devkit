import { distinctUntilChanged, Observable, takeUntil } from 'rxjs';
import { applyStrategy } from './apply-strategy';
import { getEngine } from './core/engine';
import { IvyComponentType } from './shared/decorator';
import { asapStrategy } from './strategies/asap';

/**
 * @deprecated 🚧 Work in progress.
 */
export function Microwave(strategy = asapStrategy) {
  return function MicrowaveDecorator<T>(componentType: IvyComponentType<T>) {
    applyStrategy(componentType, strategy);
  };
}

/**
 * @deprecated 🚧 Work in progress.
 */
export function watch<T, K extends keyof T = keyof T>(
  component: T,
  property: K
): Observable<T[K]> {
  const { destroyed$, watchProperty } = getEngine(component);
  return watchProperty(property).pipe(
    distinctUntilChanged(),
    takeUntil(destroyed$)
  );
}
