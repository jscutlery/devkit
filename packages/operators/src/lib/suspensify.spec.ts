import { of, Observable, throwError, Subject } from 'rxjs';
import { suspensify, Suspense } from './suspensify';
import { describe, expect, it } from '@jest/globals';
import { createObserver } from './testing/observer';

describe(suspensify.name, () => {
  const { observe } = createObserver();

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
