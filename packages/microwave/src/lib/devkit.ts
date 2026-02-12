import { getEngine, MicrowaveEngine } from './core/engine';
export function getStrategyDevKit<
  COMPONENT,
  K extends keyof COMPONENT = keyof COMPONENT,
>(component: COMPONENT): StrategyDevKit<COMPONENT, K> {
  const { changed$, destroyed$, initialized$, detach, detectChanges } =
    getEngine(component);
  return { changed$, destroyed$, initialized$, detach, detectChanges };
}
export type StrategyDevKit<T, K extends keyof T = keyof T> = Pick<
  MicrowaveEngine<T, K>,
  'changed$' | 'destroyed$' | 'initialized$' | 'detach' | 'detectChanges'
>;
export type Strategy<T> = (strategyDevKit: StrategyDevKit<T>) => void;
