import { of, Observable, throwError, Subject } from 'rxjs';
import { suspensify, Suspense } from './suspensify';

describe(suspensify.name, () => {
  let observer: jest.Mock<Suspense<'🍔'>>;

  describe('with successful source', () => {
    beforeEach(() => _suspensifyAndSubscribe(of('🍔')));

    it('should emit result with value', () => {
      expect(observer).toBeCalledTimes(1);
      expect(observer).toBeCalledWith({
        error: undefined,
        finalized: true,
        pending: false,
        value: '🍔',
      });
    });
  });

  describe('with failed source', () => {
    beforeEach(() => _suspensifyAndSubscribe(throwError(() => new Error('🐞'))));

    it('should emit result with error', () => {
      expect(observer).toBeCalledTimes(1);
      expect(observer).toBeCalledWith({
        error: new Error('🐞'),
        finalized: true,
        pending: false,
        value: undefined,
      });
    });
  });

  describe('with pending source', () => {
    let source$: Subject<'🍔'>;

    beforeEach(() => {
      source$ = new Subject<'🍔'>();
      _suspensifyAndSubscribe(source$);
    });

    afterEach(() => source$.complete());

    it('should emit result with pending=true and without value nor error', () => {
      expect(observer).toBeCalledTimes(1);
      expect(observer).toBeCalledWith({
        error: undefined,
        finalized: false,
        pending: true,
        value: undefined,
      });
    });

    it('should reset pending to false when value is emitted', () => {
      observer.mockClear();

      source$.next('🍔');

      expect(observer).toBeCalledTimes(1);
      expect(observer).toBeCalledWith({
        error: undefined,
        finalized: false,
        pending: false,
        value: '🍔',
      });
    });
  });

  describe('with failed source after emitting value', () => {
    let source$: Subject<'🍔'>;

    beforeEach(() => {
      source$ = new Subject<'🍔'>();
      _suspensifyAndSubscribe(source$);
    });

    afterEach(() => source$.complete());

    it('should reset pending to false on error', () => {
      observer.mockClear();

      source$.error(new Error('🐞'));

      expect(observer).toBeCalledTimes(1);
      expect(observer).toBeCalledWith(
        expect.objectContaining({
          pending: false,
          error: new Error('🐞'),
        })
      );
    });
  });

  describe('with projector', () => {
    beforeEach(() =>
      _suspensifyAndSubscribe(of('🍔'), {
        projector: ({ error, finalized, pending, value }) => ({
          e: error,
          f: finalized,
          p: pending,
          v: value,
        }),
      })
    );

    it('should project using custom projector', () => {
      expect(observer).toHaveBeenLastCalledWith({
        e: undefined,
        f: true,
        p: false,
        v: '🍔',
      });
    });
  });

  /**
   * Apply `suspensify` operator, subscribe and notify `observer`.
   */
  function _suspensifyAndSubscribe<R>(
    source$: Observable<'🍔'>,
    { projector }: { projector?: (data: Suspense<'🍔'>) => R } = {}
  ) {
    const result$ = source$.pipe(suspensify(projector));
    observer = jest.fn();
    result$.subscribe(observer);
  }
});
