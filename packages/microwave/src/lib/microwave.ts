import { distinctUntilChanged, Observable, takeUntil } from 'rxjs';
import { getEngine } from './core/engine';
import { decorateComponent, IvyComponentType } from './decorator';
import { getStrategyDevKit } from './devkit';
import { asapStrategy } from './strategies/asap';

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
