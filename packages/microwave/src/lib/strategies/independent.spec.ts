import { defer, Observable, Subject } from 'rxjs';
import { createIndependentStrategy } from './independent';

describe(createIndependentStrategy.name, () => {
  xit('🚧 should detach change detector immediately', () => {
    const { detach } = setUp();
    expect(detach).toBeCalledTimes(1);
  });

  xit('🚧 should not trigger change detection too early', () => {
    const { detectChanges } = setUp();
    expect(detectChanges).not.toBeCalled();
  });

  xit('🚧 should not trigger change detection before initialization', () => {
    const { detectChanges, markChanged } = setUp();

    markChanged();

    expect(detectChanges).not.toBeCalled();
  });

  xit('🚧 should trigger change detection after initialized then destroyed', () => {
    const {
      detectChanges,
      markInitialized,
      markChanged,
      markDestroyed,
      clearMocks,
    } = setUp();

    markInitialized();
    markDestroyed();
    clearMocks();

    markChanged();

    expect(detectChanges).not.toBeCalled();
  });

  xit('🚧 should trigger change detection when initialized', () => {
    const { detectChanges, markInitialized } = setUp();

    markInitialized();

    expect(detectChanges).toBeCalledTimes(1);
  });

  xit('🚧 should trigger change detection when changed', () => {
    const { detectChanges, markInitialized, markChanged, clearMocks } = setUp();

    markInitialized();
    clearMocks();

    markChanged();

    expect(detectChanges).toBeCalledTimes(1);
  });

  xit('🚧 should coalesce using given coalescing source', async () => {
    const {
      detectChanges,
      markInitialized,
      markChanged,
      clearMocks: clearMocks,
    } = setUp({ coalesce: defer(() => Promise.resolve()) });

    markInitialized();
    clearMocks();

    markChanged();
    markChanged();
    markChanged();

    const beforeCount = detectChanges.mock.calls.length;
    await flushMicrotasks();
    const afterCount = detectChanges.mock.calls.length;

    expect(beforeCount).toEqual(0);
    expect(afterCount).toEqual(1);
  });

  function setUp({ coalesce }: { coalesce?: Observable<void> } = {}) {
    const strategy = createIndependentStrategy({ coalesce });

    const initialized$ = new Subject<void>();
    const changed$ = new Subject<void>();
    const destroyed$ = new Subject<void>();
    const detach = jest.fn();
    const detectChanges = jest.fn();

    const devkit = {
      initialized$,
      changed$,
      destroyed$,
      detach,
      detectChanges,
    };

    strategy(devkit);

    const markInitialized = () => initialized$.next();
    const markChanged = () => changed$.next();
    const markDestroyed = () => destroyed$.next();

    return {
      markInitialized,
      markChanged,
      markDestroyed,
      clearMocks() {
        detach.mockClear();
        detectChanges.mockClear();
      },
      detach,
      detectChanges,
    };
  }

  async function flushMicrotasks() {
    await Promise.resolve();
  }
});
