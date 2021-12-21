import {
  debounce,
  distinctUntilChanged,
  Observable,
  startWith,
  takeUntil,
} from 'rxjs';
import { decorateComponent, IvyComponentType } from './decorator';
import { getEngine } from './engine';

/**
 * @deprecated 🚧 Work in progress.
 */
export function Microwave() {
  return function MicrowaveDecorator<T>(componentType: IvyComponentType<T>) {
    _bindComponentToEngine(componentType);
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

export function _bindComponentToEngine<T>(componentType: IvyComponentType<T>) {
  decorateComponent(componentType, {
    onCreate(component, { detach, detectChanges }) {
      const { destroyed$, propertyChanges$ } = getEngine(component);

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
