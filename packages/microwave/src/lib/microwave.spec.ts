import { ChangeDetectorRef, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createObserver } from '../../testing/observer';
import { finalize } from 'rxjs';
import { Microwave, watch } from './microwave';

@Component({
  template: `{{ meal }} is {{ evaluation }}`,
})
@Microwave()
class GreetingsComponent {
  meal?: string;
  evaluation = 'meh';
}

jest.useFakeTimers();

describe(Microwave.name, () => {
  const { observe } = createObserver();

  it('should detach change detector on startup', () => {
    const { cdRef } = createComponent();
    expect(cdRef.detach).toBeCalledTimes(1);
  });

  it('should not trigger change detection before one tick', () => {
    const { cdRef } = createComponent();
    expect(cdRef.detectChanges).toBeCalledTimes(0);
  });

  it('should trigger change detection after one tick', async () => {
    const { cdRef } = createComponent();
    await flushMicrotasks();

    expect(cdRef.detectChanges).toBeCalledTimes(1);
  });

  it('should trigger change detection once when fields change', async () => {
    const { cdRef, component } = createComponent();
    await flushMicrotasks();
    cdRef.detectChanges.mockReset();

    component.meal = 'Lasagna';
    component.evaluation = 'Delicious';

    await flushMicrotasks();

    expect(cdRef.detectChanges).toBeCalledTimes(1);
  });

  it('should stop triggering change detection on destroy', async () => {
    const { cdRef, component, destroy } = createComponent();
    await flushMicrotasks();
    cdRef.detectChanges.mockReset();

    component.evaluation = 'Delicious';

    destroy();

    await flushMicrotasks();

    expect(cdRef.detectChanges).toBeCalledTimes(0);
  });

  describe(watch.name, () => {
    it('should emit undefined value', () => {
      const { component } = createComponent();

      const meal$ = watch(component, 'meal');

      const spy = observe(meal$);

      expect(spy.next).toBeCalledTimes(1);
      expect(spy.next).toBeCalledWith(undefined);
    });

    it('should emit initial value', () => {
      const { component } = createComponent();

      const evaluation$ = watch(component, 'evaluation');

      const spy = observe(evaluation$);

      expect(spy.next).toBeCalledTimes(1);
      expect(spy.next).toBeCalledWith('meh');
    });

    it('should emit changes', () => {
      const { component } = createComponent();

      const evaluation$ = watch(component, 'evaluation');

      const spy = observe(evaluation$);

      component.evaluation = 'Delicious';

      expect(spy.next).toBeCalledTimes(2);
      expect(spy.next).lastCalledWith('Delicious');
    });

    it('should emit distinct values only', () => {
      const { component } = createComponent();

      const evaluation$ = watch(component, 'evaluation');

      const spy = observe(evaluation$);

      component.evaluation = 'meh';

      expect(spy.next).toBeCalledTimes(1);
    });

    it('should stop watching on destroy', () => {
      const { component, destroy } = createComponent();

      const finalizeSpy = jest.fn();
      const evaluation$ = watch(component, 'evaluation').pipe(
        finalize(finalizeSpy)
      );

      observe(evaluation$);

      destroy();

      expect(finalizeSpy).toBeCalledTimes(1);
    });

    it('should throw error if not microwaved', () => {
      expect(() => watch({ name: 'foo' }, 'name')).toThrow(/not microwaved/);
    });
  });

  function createComponent() {
    const mock: jest.Mocked<
      Pick<ChangeDetectorRef, 'detach' | 'detectChanges'>
    > = {
      detach: jest.fn(),
      detectChanges: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        GreetingsComponent,
        {
          provide: ChangeDetectorRef,
          useValue: mock,
        },
      ],
    });

    const component = TestBed.inject(GreetingsComponent);

    return {
      component,
      cdRef: mock,
      destroy() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (component as any).ngOnDestroy();
      },
    };
  }

  async function flushMicrotasks() {
    await Promise.resolve();
  }
});
