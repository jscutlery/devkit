import { NEVER, of, Subject } from 'rxjs';
import { asapStrategy } from './asap';

describe(asapStrategy.name, () => {
  it('should coalesce using microtasks', async () => {
    const { detectChanges, markChanged } = setUp();

    markChanged();

    const beforeCount = detectChanges.mock.calls.length;
    await Promise.resolve();
    const aftertCount = detectChanges.mock.calls.length;

    expect(beforeCount).toEqual(0);
    expect(aftertCount).toEqual(1);
  });

  function setUp() {
    const changed$ = new Subject<void>();
    const detach = jest.fn();
    const detectChanges = jest.fn();

    asapStrategy({
      initialized$: of(undefined),
      changed$,
      destroyed$: NEVER,
      detach,
      detectChanges,
    });

    const markChanged = () => changed$.next();
    return {
      markChanged,
      clearMocks() {
        detach.mockClear();
        detectChanges.mockClear();
      },
      detach,
      detectChanges,
    };
  }
});
