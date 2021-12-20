import { ChangeDetectorRef, Component, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { finalize } from 'rxjs';
import { createObserver } from '../../testing/observer';
import { Microwave, watch } from './microwave';

describe(Microwave.name, () => {
  const { observe } = createObserver();

  it('should detach change detector on startup', () => {
    const { cdRef } = createComponent(GreetingsComponent);
    expect(cdRef.detach).toBeCalledTimes(1);
  });

  it('should not trigger change detection before one tick', () => {
    const { cdRef } = createComponent(GreetingsComponent);
    expect(cdRef.detectChanges).toBeCalledTimes(0);
  });

  it('should trigger change detection after one tick', async () => {
    const { cdRef, flushMicrotasks } = createComponent(GreetingsComponent);
    await flushMicrotasks();

    expect(cdRef.detectChanges).toBeCalledTimes(1);
  });

  it('should trigger change detection once when fields change', async () => {
    const { cdRef, component, flushMicrotasks } =
      createComponent(GreetingsComponent);
    await flushMicrotasks();
    cdRef.detectChanges.mockReset();

    component.meal = 'Lasagna';
    component.evaluation = 'Delicious';

    await flushMicrotasks();

    expect(cdRef.detectChanges).toBeCalledTimes(1);
  });

  it('should stop triggering change detection on destroy', async () => {
    const {
      cdRef,
      component,
      destroy,
      flushMicrotasks,
      flushMicrotasksAndResetMocks,
    } = createComponent(GreetingsComponent);
    await flushMicrotasksAndResetMocks();

    component.evaluation = 'Delicious';

    destroy();

    await flushMicrotasks();

    expect(cdRef.detectChanges).toBeCalledTimes(0);
  });

  describe(watch.name, () => {
    describe('with eager watch', () => {
      it('should emit initial value', () => {
        const { component } = createComponent(GreetingsWithWatchComponent);
        const spy = observe(component.evaluation$);

        expect(spy.next).toBeCalledTimes(1);
        expect(spy.next).toBeCalledWith('meh');
      });

      it('should emit changes', () => {
        const { component } = createComponent(GreetingsWithWatchComponent);
        const spy = observe(component.evaluation$);

        component.evaluation = 'Delicious';

        expect(spy.next).toBeCalledTimes(2);
        expect(spy.next).lastCalledWith('Delicious');
      });
    });

    describe('with late watch', () => {
      it('should emit undefined value', () => {
        const { component } = createComponent(GreetingsComponent);

        const meal$ = watch(component, 'meal');

        const spy = observe(meal$);

        expect(spy.next).toBeCalledTimes(1);
        expect(spy.next).toBeCalledWith(undefined);
      });

      it('should emit initial value', () => {
        const { component } = createComponent(GreetingsComponent);

        const evaluation$ = watch(component, 'evaluation');

        const spy = observe(evaluation$);

        expect(spy.next).toBeCalledTimes(1);
        expect(spy.next).toBeCalledWith('meh');
      });

      it('should emit changes', () => {
        const { component } = createComponent(GreetingsComponent);

        const evaluation$ = watch(component, 'evaluation');

        const spy = observe(evaluation$);

        component.evaluation = 'Delicious';

        expect(spy.next).toBeCalledTimes(2);
        expect(spy.next).lastCalledWith('Delicious');
      });

      it('should emit distinct values only', () => {
        const { component } = createComponent(GreetingsComponent);

        const evaluation$ = watch(component, 'evaluation');

        const spy = observe(evaluation$);

        component.evaluation = 'meh';

        expect(spy.next).toBeCalledTimes(1);
      });

      it('should stop watching on destroy', () => {
        const { component, destroy } = createComponent(GreetingsComponent);

        const finalizeSpy = jest.fn();
        const evaluation$ = watch(component, 'evaluation').pipe(
          finalize(finalizeSpy)
        );

        observe(evaluation$);

        destroy();

        expect(finalizeSpy).toBeCalledTimes(1);
      });
    });
  });

  function createComponent<T>(componentClass: Type<T>) {
    const mock: jest.Mocked<
      Pick<ChangeDetectorRef, 'detach' | 'detectChanges'>
    > = {
      detach: jest.fn(),
      detectChanges: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        componentClass,
        {
          provide: ChangeDetectorRef,
          useValue: mock,
        },
      ],
    });

    const component = TestBed.inject(componentClass);

    async function flushMicrotasks() {
      await Promise.resolve();
    }

    return {
      component,
      cdRef: mock,
      destroy() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (component as any).ngOnDestroy();
      },
      flushMicrotasks,
      async flushMicrotasksAndResetMocks() {
        await flushMicrotasks();
        mock.detach.mockReset();
        mock.detectChanges.mockReset();
      },
    };
  }
});

@Microwave()
@Component({
  template: `{{ meal }} is {{ evaluation }}`,
})
class GreetingsComponent {
  meal?: string;
  evaluation = 'meh';
}

@Microwave()
@Component({
  template: `{{ meal }} is {{ evaluation }}`,
})
class GreetingsWithWatchComponent {
  meal?: string;
  evaluation = 'meh';
  evaluation$ = watch(this, 'evaluation');
}
