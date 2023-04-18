import { describe, expect, it } from '@jest/globals';
import { Observable, Subject, firstValueFrom, of, throwError } from 'rxjs';
import { suspensify } from './suspensify';
import { createObserver } from './testing/observer';

describe(suspensify.name, () => {
  const { observe } = createObserver();

  describe('strict mode', () => {
    xit('🚧 should always have pending, finalized, hasValue & hasError properties', async () => {
      // const suspense = await getFirstSuspenseValue();
      // suspense.pending;
      // suspense.finalized;
      // suspense.hasError;
      // suspense.hasValue;
    });

    xit('🚧 should not have value or error before narrowing', async () => {
      // const suspense = await getFirstSuspenseValue();
      // // @ts-expect-error error property should not exist before narrowing
      // suspense.error;
      // // @ts-expect-error value property should not exist before narrowing
      // suspense.value;
    });

    xit('🚧 should narrow value type', async () => {
      // const suspense = await getFirstSuspenseValue();
      // if (suspense.hasValue) {
      //   suspense.value;
      //   // @ts-expect-error error property should not exist on value type
      //   suspense.error;
      // }
    });

    xit('🚧 should narrow error type', async () => {
      // const suspense = await getFirstSuspenseValue();
      // if (suspense.hasError) {
      //   suspense.error;
      //   // @ts-expect-error value property should not exist on error type
      //   suspense.value;
      // }
    });

    it.todo('🚧 should emit pending');

    it.todo('🚧 should emit value');

    it.todo('🚧 should emit error');

    it.todo('🚧 should mark finalized on error');

    it.todo('🚧 should mark finalized on complete');

    it.todo('🚧 should reset pending to false when value is emitted');

    async function getFirstSuspenseValue() {
      return await firstValueFrom(of('🍔').pipe(suspensify({ strict: true })));
    }
  });

  it('should emit result with value', () => {
    const { next } = setUp(of('🍔'));
    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith({
      error: undefined,
      finalized: true,
      pending: false,
      value: '🍔',
    });
  });

  it('should emit result with error', () => {
    const { next } = setUp(throwError(() => new Error('🐞')));
    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith({
      error: new Error('🐞'),
      finalized: true,
      pending: false,
      value: undefined,
    });
  });

  it('should emit result with pending=true and without value nor error', () => {
    const { next } = setUp(new Subject<'🍔'>());
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
    const { next } = setUp(subject);

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

  function setUp<T>(source$: Observable<T>) {
    const observer = observe(source$.pipe(suspensify()));
    return {
      next: observer.next,
    };
  }
});
