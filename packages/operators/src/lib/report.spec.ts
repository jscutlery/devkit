import { of, Observable, throwError, Subject } from 'rxjs';
import { report, ReportState } from './report';

describe(report.name, () => {
  let observer: jest.Mock<ReportState<'🍔'>>;

  describe('with successful source', () => {
    beforeEach(() => _reportAndSubscribe(of('🍔')));

    it('should emit result with value', () => {
      expect(_getEmittedValues()).toEqual([
        {
          error: undefined,
          finalized: false,
          pending: true,
          value: undefined,
        },
        {
          error: undefined,
          finalized: false,
          pending: false,
          value: '🍔',
        },
        {
          error: undefined,
          finalized: true,
          pending: false,
          value: '🍔',
        },
      ]);
    });
  });

  describe('with failed source', () => {
    beforeEach(() => _reportAndSubscribe(throwError(() => new Error('🐞'))));

    it('should emit result with error', () => {
      expect(_getEmittedValues()).toEqual([
        {
          error: undefined,
          finalized: false,
          pending: true,
          value: undefined,
        },
        {
          error: new Error('🐞'),
          finalized: true,
          pending: false,
          value: undefined,
        },
      ]);
    });
  });

  describe('with pending source', () => {
    let source$: Subject<'🍔'>;

    beforeEach(() => {
      source$ = new Subject<'🍔'>();
      _reportAndSubscribe(source$);
    });

    afterEach(() => source$.complete());

    it('should emit result with pending=true and without value nor error', () => {
      expect(_getEmittedValues()).toEqual([
        {
          error: undefined,
          finalized: false,
          pending: true,
          value: undefined,
        },
      ]);
    });

    it('should reset pending to false when value is emitted', () => {
      observer.mockClear();

      source$.next('🍔');

      expect(_getEmittedValues()).toEqual([
        {
          error: undefined,
          finalized: false,
          pending: false,
          value: '🍔',
        },
      ]);
    });
  });

  describe('failed source after emitting value', () => {
    let source$: Subject<'🍔'>;

    beforeEach(() => {
      source$ = new Subject<'🍔'>();
      _reportAndSubscribe(source$);
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

  /**
   * Apply `report` operator, subscribe and notify `observer`.
   * Emitted values can be read using {@link _getEmittedValues}.
   */
  function _reportAndSubscribe(source$: Observable<'🍔'>) {
    const result$ = source$.pipe(report());
    observer = jest.fn();
    result$.subscribe(observer);
  }

  /**
   * Return values emitted using {@link _reportAndSubscribe}
   */
  function _getEmittedValues() {
    return observer.mock.calls.map((args) => args[0]);
  }
});
