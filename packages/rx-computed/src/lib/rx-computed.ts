import {
  assertInInjectionContext,
  computed,
  effect,
  inject,
  Injector,
  signal,
  Signal,
} from '@angular/core';
import { pending, Suspense, suspensify } from '@jscutlery/operators';
import { Observable } from 'rxjs';

export function rxComputed<T, INITIAL_VALUE = T | null | undefined>(
  fn: () => Observable<T>,
  {
    initialValue,
    injector,
  }: { initialValue?: INITIAL_VALUE; injector?: Injector } = {}
): Signal<T | INITIAL_VALUE> {
  if (!injector) assertInInjectionContext(rxComputed);
  injector ??= inject(Injector);

  const sig = signal<Suspense<T | INITIAL_VALUE>>(pending);

  effect(
    (onCleanup) => {
      const sub = fn()
        .pipe(suspensify())
        .subscribe((value) => sig.set(value));
      onCleanup(() => sub.unsubscribe());
    },
    { allowSignalWrites: true, injector }
  );

  return computed(() => {
    const suspense = sig();
    if (suspense.hasError) {
      throw suspense.error;
    }

    if (suspense.hasValue) {
      return suspense.value;
    }

    return initialValue as INITIAL_VALUE;
  });
}
