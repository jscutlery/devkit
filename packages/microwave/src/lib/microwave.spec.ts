import { ChangeDetectorRef, Component, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Microwave, watch } from './microwave';

@Microwave()
@Component({
  template: `{{ meal }} is {{ evaluation }}`,
})
class GreetingsComponent {
  meal?: string;
  evaluation?: string;
}

jest.useFakeTimers();

describe(Microwave.name, () => {
  it('should detach change detector on startup', () => {
    const { cdRef } = createComponent(GreetingsComponent);
    expect(cdRef.detach).toBeCalledTimes(1);
  });

  it('should not trigger change detection before one tick', () => {
    const { cdRef } = createComponent(GreetingsComponent);
    expect(cdRef.detectChanges).toBeCalledTimes(0);
  });

  it('should trigger change detection after one tick', async () => {
    const { cdRef } = createComponent(GreetingsComponent);
    await flushMicrotasks();

    expect(cdRef.detectChanges).toBeCalledTimes(1);
  });

  xit('should trigger change detection once when properties change', async () => {
    const { cdRef, component } = createComponent(GreetingsComponent);
    await flushMicrotasks();
    cdRef.detectChanges.mockReset();

    component.meal = 'Lasagna';
    component.evaluation = 'Delicious';

    await flushMicrotasks();

    expect(cdRef.detectChanges).toBeCalledTimes(1);
  });

  describe(watch.name, () => {
    it.todo('should emit undefined value');

    it.todo('should emit initial value');

    it.todo('should emit changes');

    it.todo('should emit distinct values only');
  });

  function createComponent<T>(cmpClass: Type<T>) {
    const mock: jest.Mocked<
      Pick<ChangeDetectorRef, 'detach' | 'detectChanges'>
    > = {
      detach: jest.fn(),
      detectChanges: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        cmpClass,
        {
          provide: ChangeDetectorRef,
          useValue: mock,
        },
      ],
    });

    return {
      component: TestBed.inject(cmpClass),
      cdRef: mock,
    };
  }

  async function flushMicrotasks() {
    await Promise.resolve();
  }
});
