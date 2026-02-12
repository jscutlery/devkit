import { createStrategyGlove } from '../../../testing/create-strategy-glove';
import { asyncStrategy } from './async';
jest.useFakeTimers();
describe(asyncStrategy.name, () => {
  it('should coalesce using macrotasks', async () => {
    const { detectChanges, markChanged, markInitialized } = createStrategyGlove(
      { strategy: asyncStrategy },
    );
    markInitialized();
    markChanged();
    const beforeCount = detectChanges.mock.calls.length;
    jest.runAllTimers();
    const aftertCount = detectChanges.mock.calls.length;
    expect(beforeCount).toEqual(0);
    expect(aftertCount).toEqual(1);
  });
});
