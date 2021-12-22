import { Observable, takeUntil } from 'rxjs';
import { applyStrategy } from './apply-strategy';
import { getEngine } from './core/engine';
import { IvyComponentType } from './shared/decorator';
import { asapStrategy } from './strategies/asap';

export function Microwave({ strategy = asapStrategy } = {}) {
  return function MicrowaveDecorator<T>(componentType: IvyComponentType<T>) {
    applyStrategy(componentType, strategy);
  };
}

export function watch<T, K extends keyof T = keyof T>(
  component: T,
  property: K
): Observable<T[K] | undefined> {
  const { destroyed$, watchProperty } = getEngine(component);
  return watchProperty(property).pipe(takeUntil(destroyed$));
}
