import { of, Observable, throwError, Subject } from 'rxjs';
import { report, ReportState } from './report';

describe(report.name, () => {
  let observer: jest.Mock<ReportState<'🍔'>>;

  describe('with successful source', () => {
    beforeEach(() => reportAndSubscribe(of('🍔')));

    xit('🚧 should emit result with value', () => {
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
    beforeEach(() => reportAndSubscribe(throwError(() => new Error('🐞'))));

    xit('🚧 should emit result with error', () => {
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
      reportAndSubscribe(source$);
    });

    afterEach(() => source$.complete());

    xit('🚧 should emit result with pending=true and without value nor error', () => {
      expect(observer).toBeCalledTimes(1);
      expect(observer).toBeCalledWith({
        error: undefined,
        finalized: false,
        pending: true,
        value: undefined,
      });
    });

    xit('🚧 should reset pending to false when value is emitted', () => {
      observer.mockClear();

      source$.next('🍔');

      expect(observer).toBeCalledTimes(1);
      expect(observer).toBeCalledWith(
        expect.objectContaining({
          pending: false,
          value: '🍔',
        })
      );
    });
  });

  describe('failed source after emitting value', () => {
    let source$: Subject<'🍔'>;

    beforeEach(() => {
      source$ = new Subject<'🍔'>();
      reportAndSubscribe(source$);
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

  function reportAndSubscribe(source$: Observable<'🍔'>) {
    const result$ = source$.pipe(report());
    observer = jest.fn();
    result$.subscribe(observer);
  }
});
