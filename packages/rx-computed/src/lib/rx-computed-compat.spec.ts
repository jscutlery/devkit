import { effect, Injector, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { rxComputed } from './rx-computed';
import { Observable } from 'rxjs';

jest.mock('@angular/core', () => {
  const core = jest.requireActual('@angular/core');
  return {
    ...core,
    effect: jest.fn(),
  };
});

describe(rxComputed.name, () => {
  it('does not use deprecated `allowSignalWrites` option', () => {
    const effectSpy = effect as jest.Mock;
    runInTestingInjectionContext(() => rxComputed(() => new Observable()));
    expect(effectSpy.mock.lastCall[1].allowSignalWrites).not.toBeDefined();
  });
});

function runInTestingInjectionContext<T>(fn: () => T): T {
  const injector = TestBed.inject(Injector);
  return runInInjectionContext(injector, fn);
}
