import { getEngine } from './core/engine';
import { getStrategyDevKit, Strategy } from './devkit';
import { decorateComponent, IvyComponentType } from './shared/decorator';

export function applyStrategy<T>(
  componentType: IvyComponentType<T>,
  strategy: Strategy<T>
) {
  _bindComponentToEngine(componentType, {
    onCreate(component) {
      strategy(getStrategyDevKit(component));
    },
  });
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
