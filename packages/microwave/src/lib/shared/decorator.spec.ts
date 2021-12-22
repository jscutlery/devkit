import { createTestingBowl } from '../../../testing/testing-bowl';
import { decorateComponent, DecoratorHooks } from './decorator';

describe(decorateComponent.name, () => {
  const bowl = createTestingBowl(setUp);

  it.todo('🚧 should trigger real ngOnInit');

  it.todo('🚧 should trigger real ngOnDestroy');

  it.todo('🚧 should trigger onCreate');

  it.todo('🚧 should trigger onInit');

  it.todo('🚧 should trigger onDestroy');

  it.todo('🚧 should trigger onPropertyDeclare');

  it.todo('🚧 should trigger onPropertyGet');

  it.todo('🚧 should trigger onPropertySet');

  function setUp() {
    const ngOnInit = jest.fn();
    const ngOnDestroy = jest.fn();

    class MyComponent {
      something?: number = undefined;

      ngOnInit() {
        ngOnInit();
      }

      ngOnDestroy() {
        ngOnDestroy();
      }
    }

    const mockHooks: jest.Mocked<DecoratorHooks<MyComponent>> = {
      onCreate: jest.fn(),
      onDestroy: jest.fn(),
      onPropertyDeclare: jest.fn(),
      onPropertyGet: jest.fn(),
      onPropertySet: jest.fn(),
    };

    return {
      MyComponent,
      mockHooks,
      ngOnInit,
      ngOnDestroy,
    };
  }
});
