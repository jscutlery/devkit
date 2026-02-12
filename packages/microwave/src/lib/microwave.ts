import { Observable, takeUntil } from 'rxjs';
import { applyStrategy } from './apply-strategy';
import { getEngine } from './core/engine';
import { IvyComponentType } from './shared/decorator';
import { asapStrategy } from './strategies';
export function Microwave({ strategy = asapStrategy } = {}) {
  return function MicrowaveDecorator<T>(componentType: IvyComponentType<T>) {
    applyStrategy(componentType, strategy);
  };
}
export function watch<COMPONENT, K extends keyof COMPONENT = keyof COMPONENT>(
  component: COMPONENT,
  property: K,
): Observable<COMPONENT[K] | undefined> {
  const { destroyed$, watchProperty } = getEngine(component);
  return watchProperty(property).pipe(takeUntil(destroyed$));
}
