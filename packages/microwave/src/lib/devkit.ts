import { getEngine, Microwaved, MicrowaveEngine } from './core/engine';

export function getStrategyDevKit<T, K extends keyof T = keyof T>(
  component: Microwaved<T, K>
): StrategyDevKit<T, K> {
  const { destroyed$, propertyChanges$, detach, detectChanges } =
    getEngine(component);
  return { destroyed$, propertyChanges$, detach, detectChanges };
}

export type StrategyDevKit<T, K extends keyof T = keyof T> = Pick<
  MicrowaveEngine<T, K>,
  'destroyed$' | 'propertyChanges$' | 'detach' | 'detectChanges'
>;

export type Strategy<T> = (strategyDevKit: StrategyDevKit<T>) => void;
