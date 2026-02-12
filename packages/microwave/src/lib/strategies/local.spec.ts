import { createStrategyGlove } from '../../../testing/create-strategy-glove';
import { MonoTypeOperatorFunction, Subject, switchMap } from 'rxjs';
import { createLocalStrategy } from './local';
describe(createLocalStrategy.name, () => {
  it('should detach change detector immediately', () => {
    const { detach } = setUp();
    expect(detach).toHaveBeenCalledTimes(1);
  });
  it('should not trigger change detection too early', () => {
    const { detectChanges } = setUp();
    expect(detectChanges).not.toHaveBeenCalled();
  });
  it('should not trigger change detection before initialization', () => {
    const { detectChanges, markChanged } = setUp();
    markChanged();
    expect(detectChanges).not.toHaveBeenCalled();
  });
  it('should trigger change detection after initialized then destroyed', () => {
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
    expect(detectChanges).not.toHaveBeenCalled();
  });
  it('should trigger change detection when initialized', () => {
    const { detectChanges, markInitialized } = setUp();
    markInitialized();
    expect(detectChanges).toHaveBeenCalledTimes(1);
  });
  it('should trigger change detection when changed', () => {
    const { detectChanges, markInitialized, markChanged, clearMocks } = setUp();
    markInitialized();
    clearMocks();
    markChanged();
    expect(detectChanges).toHaveBeenCalledTimes(1);
  });
  it('should coalesce using given coalescing source', () => {
    /* A subject to simulate the coalescer's tick. */
    const coalescerSubject = new Subject<void>();
    const { detectChanges, markInitialized, markChanged } = setUp({
      coalescer: switchMap(() => coalescerSubject),
    });
    markInitialized();
    markChanged();
    markChanged();
    markChanged();
    const beforeCount = detectChanges.mock.calls.length;
    /* The coalescer's tick. */
    coalescerSubject.next();
    const afterCount = detectChanges.mock.calls.length;
    expect(beforeCount).toEqual(0);
    expect(afterCount).toEqual(1);
  });
  function setUp({
    coalescer,
  }: {
    coalescer?: MonoTypeOperatorFunction<void>;
  } = {}) {
    const strategy = createLocalStrategy({ coalescer });
    return createStrategyGlove({ strategy });
  }
});
