import { createObserver } from '../../../testing/observer';
import { createTestingBowl } from '../../../testing/testing-bowl';
import { getEngine } from './engine';

describe(getEngine.name, () => {
  const bowl = createTestingBowl(setUp);
  const { observe } = createObserver();

  xit('should mark initialized', () => {
    const { engine } = bowl;

    // const spy = observe(engine.initialized$);

    // engine.markInitialized();

    // expect(spy.next).toBeCalledTimes(1);
  });

  function setUp() {
    class MyClass {}

    const instance = new MyClass();

    const engine = getEngine(instance);

    return {
      engine,
    };
  }
});
