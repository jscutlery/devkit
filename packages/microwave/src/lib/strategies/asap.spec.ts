import { createStrategyGlove } from '../../../testing/create-strategy-glove';
import { asapStrategy } from './asap';

describe(asapStrategy.name, () => {
  it('should coalesce using microtasks', async () => {
    const { detectChanges, markChanged, markInitialized } = createStrategyGlove(
      { strategy: asapStrategy }
    );

    markInitialized();
    markChanged();

    const beforeCount = detectChanges.mock.calls.length;
    await Promise.resolve();
    const aftertCount = detectChanges.mock.calls.length;

    expect(beforeCount).toEqual(0);
    expect(aftertCount).toEqual(1);
  });
});
