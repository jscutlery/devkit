import { describe, expect, it } from '@jest/globals';
import {
  EMPTY,
  Observable,
  Subject,
  firstValueFrom,
  of,
  throwError,
} from 'rxjs';
import { suspensify } from './suspensify';
import { createObserver } from './testing/observer';

describe(suspensify.name, () => {
  const { observe } = createObserver();

  describe('strict mode', () => {
    it('should always have pending, finalized, hasValue & hasError properties', async () => {
      const suspense = await getFirstSuspenseValue();
      suspense.pending;
      suspense.finalized;
      suspense.hasError;
      suspense.hasValue;
    });

    it('should not have value or error before narrowing', async () => {
      const suspense = await getFirstSuspenseValue();
      // @ts-expect-error error property should not exist before narrowing
      suspense.error;
      // @ts-expect-error value property should not exist before narrowing
      suspense.value;
    });

    it('should narrow value type', async () => {
      const suspense = await getFirstSuspenseValue();
      if (suspense.hasValue) {
        suspense.value;
        // @ts-expect-error error property should not exist on value type
        suspense.error;
      }
    });

    it('should narrow error type', async () => {
      const suspense = await getFirstSuspenseValue();
      if (suspense.hasError) {
        suspense.error;
        // @ts-expect-error value property should not exist on error type
        suspense.value;
      }
    });

    xit('🚧 should emit pending', () => {
      const { next } = setUp(new Subject<'🍔'>());
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith({
        finalized: false,
        hasError: false,
        hasValue: false,
        pending: true,
      });
    });

    xit('🚧 should emit value', () => {
      const subject = new Subject<'🍔'>();
      subject.next('🍔');

      const { next } = setUp(subject);

      expect(next).toBeCalledWith({
        finalized: false,
        hasError: false,
        hasValue: true,
        pending: false,
        value: '🍔',
      });
    });

    xit('🚧 should emit once (not pending + value)', () => {
      const { next } = setUp(of('🍔'));
      expect(next).toBeCalledTimes(1);
    });

    it('🚧 should emit error', () => {
      const { next } = setUp(throwError(() => new Error('🐞')));
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith({
        finalized: true,
        hasError: true,
        hasValue: false,
        pending: false,
        error: new Error('🐞'),
      });
    });

    xit('🚧 should mark finalized on complete with value', () => {
      const { next } = setUp(of('🍔'));

      expect(next).toBeCalledWith({
        finalized: true,
        hasError: false,
        hasValue: true,
        pending: false,
        value: '🍔',
      });
    });

    xit('🚧 should mark finalized on complete without value', () => {
      const { next } = setUp(EMPTY);

      expect(next).toBeCalledWith({
        finalized: true,
        hasError: false,
        hasValue: false,
        pending: false,
      });
    });

    xit('🚧 should reset pending to false when value is emitted', () => {
      const subject = new Subject<'🍔'>();
      const { next } = setUp(subject);

      subject.error(new Error('🐞'));

      expect(next).toBeCalledTimes(2);
      expect(next).lastCalledWith(
        expect.objectContaining({
          pending: false,
          error: new Error('🐞'),
        })
      );
    });

    async function getFirstSuspenseValue() {
      return await firstValueFrom(of('🍔').pipe(suspensify({ strict: true })));
    }

    function setUp<T>(source$: Observable<T>) {
      const observer = observe(source$.pipe(suspensify({ strict: true })));
      return {
        next: observer.next,
      };
    }
  });

  it('should emit result with value', () => {
    const { next } = setUpLax(of('🍔'));
    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith({
      error: undefined,
      finalized: true,
      pending: false,
      value: '🍔',
    });
  });

  it('should emit result with error', () => {
    const { next } = setUpLax(throwError(() => new Error('🐞')));
    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith({
      error: new Error('🐞'),
      finalized: true,
      pending: false,
      value: undefined,
    });
  });

  it('should emit result with pending=true and without value nor error', () => {
    const { next } = setUpLax(new Subject<'🍔'>());
    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith({
      error: undefined,
      finalized: false,
      pending: true,
      value: undefined,
    });
  });

  it('should reset pending to false when value is emitted', () => {
    const subject = new Subject<'🍔'>();
    const { next } = setUpLax(subject);

    subject.next('🍔');

    expect(next).toBeCalledTimes(2);
    expect(next).lastCalledWith({
      error: undefined,
      finalized: false,
      pending: false,
      value: '🍔',
    });
  });

  it('should reset pending to false on error', () => {
    const subject = new Subject<'🍔'>();
    const { next } = setUpLax(subject);

    subject.error(new Error('🐞'));

    expect(next).toBeCalledTimes(2);
    expect(next).lastCalledWith(
      expect.objectContaining({
        pending: false,
        error: new Error('🐞'),
      })
    );
  });

  function setUpLax<T>(source$: Observable<T>) {
    const observer = observe(source$.pipe(suspensify()));
    return {
      next: observer.next,
    };
  }
});
