import { createObserver } from '../../../testing/observer';
import { createTestingBowl } from '../../../testing/testing-bowl';
import { getEngine } from './engine';
describe(getEngine.name, () => {
  const bowl = createTestingBowl(setUp);
  const { observe } = createObserver();
  it('should mark initialized', () => {
    const { engine } = bowl;
    const spy = observe(engine.initialized$);
    engine.markInitialized();
    expect(spy.next).toBeCalledTimes(1);
    expect(spy.complete).toBeCalledTimes(1);
  });
  it('should mark destroyed', () => {
    const { engine } = bowl;
    const spy = observe(engine.destroyed$);
    engine.markDestroyed();
    expect(spy.next).toBeCalledTimes(1);
    expect(spy.complete).toBeCalledTimes(1);
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
