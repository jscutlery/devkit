import { createTestingBowl } from '../../../testing/testing-bowl';
import { createStrategyGlove } from '../../../testing/create-strategy-glove';
import { rafStrategy } from './raf';
describe(rafStrategy.name, () => {
  const bowl = createTestingBowl(setUp);
  afterEach(() => {
    /* Restore requestAnimationFrame. */
    jest.restoreAllMocks();
  });
  it('should coalesce using animation frames', () => {
    const {
      detectChanges,
      markChanged,
      markInitialized,
      flushRequestAnimationFrame,
      mockRaf,
    } = bowl;
    markInitialized();
    markChanged();
    const beforeCount = detectChanges.mock.calls.length;
    flushRequestAnimationFrame();
    const aftertCount = detectChanges.mock.calls.length;
    expect(beforeCount).toEqual(0);
    expect(aftertCount).toEqual(1);
    /* Make sure the callback is registered once. */
    expect(mockRaf).toBeCalledTimes(1);
  });
  function setUp() {
    const mockRaf = jest.spyOn(globalThis, 'requestAnimationFrame');
    return {
      mockRaf,
      flushRequestAnimationFrame() {
        const callbacks = mockRaf.mock.calls.map((call) => call[0]);
        for (const callback of callbacks) {
          callback(performance.now());
        }
      },
      ...createStrategyGlove({ strategy: rafStrategy }),
    };
  }
});
