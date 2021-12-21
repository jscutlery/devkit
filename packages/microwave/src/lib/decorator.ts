import { ChangeDetectorRef, Type, ɵɵdirectiveInject } from '@angular/core';
import { noop } from 'rxjs';
import { __decorate } from 'tslib';

/**
 * Decorate Angular components with custom hooks.
 * 
 * @param componentType the component class to decorate.
 * @param hooks 
 */
export function decorateComponent<T, K extends keyof T = keyof T>(
  componentType: IvyComponentType<T>,
  hooks: DecoratorHooks<T>
) {
  const {
    onCreate,
    onDestroy,
    onPropertyDeclare,
    onPropertyGet,
    onPropertySet,
  } = hooks;

  if (!componentType.ɵfac) {
    throw new Error(
      `${componentType.name} is either not a component or not compiled.`
    );
  }

  /**
   * Override component factory.
   */
  const factory = __decorate(
    [
      /*
       * Override getters & setters.
       */
      (factoryFn: () => T) => () => {
        /* Grab change detector to control it. */
        const cdr = ɵɵdirectiveInject(ChangeDetectorRef);

        const component = factoryFn();

        /**
         * Notify about creation.
         */
        onCreate(component, {
          detach() {
            cdr.detach();
          },
          detectChanges() {
            cdr.detectChanges();
          },
        });

        /**
         * This will only list initialized properties.
         * That's the reason why all properties should be initialized
         * when using Microwave.
         */
        for (const property of Object.getOwnPropertyNames(
          component
        ) as Array<K>) {
          /**
           * Notify when property is discovered.
           */
          onPropertyDeclare(component, property, component[property]);

          Object.defineProperty(component, property, {
            set(value) {
              /**
               * Call setter.
               */
              onPropertySet(component, property, value);
            },
            get() {
              /**
               * Call getter.
               */
              return onPropertyGet(component, property);
            },
          });
        }

        return component;
      },
    ],
    componentType.ɵfac
  );

  /**
   * Override factory with the newly decorated one.
   */
  Object.defineProperty(componentType, 'ɵfac', {
    get() {
      return factory;
    },
  });

  /**
   * Override ngOnDestroy.
   */
  componentType.prototype.ngOnDestroy = __decorate(
    [
      (ngOnDestroy: () => void) => {
        return function (this: T) {
          onDestroy(this);
          return ngOnDestroy();
        };
      },
    ],
    /* @hack use noop, otherwise, __decorate will not decorate the function. */
    componentType.prototype.ngOnDestroy ?? noop
  );
}

export interface DecoratorHooks<T, K extends keyof T = keyof T> {
  /**
   * Hook called when a new component is created.
   *
   * @param component the created component.
   * @param args change detection functions for controlling change detection.
   */
  onCreate(
    component: T,
    args: { detach: () => void; detectChanges: () => void }
  ): void;

  /**
   * Hook called just before the real ngOnDestroy (if implemented) is called.
   */
  onDestroy(component: T): void;

  /**
   * Hook called when a property is discovered.
   * This is the opportunity to grab the initial value before
   * the property is replaced by getters and setters.
   */
  onPropertyDeclare(component: T, property: K, value: T[K]): void;

  /**
   * Hook called to retrieve a property.
   */
  onPropertyGet(component: T, property: K): T[K];

  /**
   * Hook called to set a property.
   */
  onPropertySet(component: T, property: K, value: T[K]): void;
}

export interface IvyComponentType<T> extends Type<T> {
  ɵfac?: () => T;
}
