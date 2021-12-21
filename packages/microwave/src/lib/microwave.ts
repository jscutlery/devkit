import { ChangeDetectionFns } from './change-detection-fns';
import {
  debounce,
  distinctUntilChanged,
  Observable,
  startWith,
  takeUntil,
} from 'rxjs';
import { decorateComponent, IvyComponentType } from './decorator';
import { getEngine, getStrategyDevKit, StrategyDevKit } from './engine';

/**
 * @deprecated 🚧 Work in progress.
 */
export function Microwave(strategy = asapStrategy) {
  return function MicrowaveDecorator<T>(componentType: IvyComponentType<T>) {
    _bindComponentToEngine(componentType, {
      onCreate(component) {
        strategy(getStrategyDevKit(component));
      },
    });
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

export const asapStrategy = <T>({
  destroyed$,
  propertyChanges$,
  detectChanges,
  detach,
}: StrategyDevKit<T>) => {
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

export function _bindComponentToEngine<T>(
  componentType: IvyComponentType<T>,
  { onCreate }: { onCreate: (component: T) => void }
) {
  decorateComponent(componentType, {
    onCreate(component, changeDetectionFns) {
      getEngine(component).setChangeDetectionFns(changeDetectionFns);
      onCreate(component);
    },
    onDestroy(component) {
      getEngine(component).markDestroyed();
    },
    onPropertyDeclare(component, property, value) {
      getEngine(component).setProperty(property, value);
    },
    onPropertyGet(component, property) {
      return getEngine(component).getProperty(property);
    },
    onPropertySet(component, property, value) {
      getEngine(component).setProperty(property, value);
    },
  });
}
