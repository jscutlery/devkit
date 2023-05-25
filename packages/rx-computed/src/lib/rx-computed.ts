import { computed, effect, signal, Signal } from '@angular/core';
import { pending, Suspense, suspensify } from '@jscutlery/operators';
import { Observable } from 'rxjs';

export function rxComputed<T, INITIAL_VALUE = T | null | undefined>(
  fn: () => Observable<T>,
  { initialValue }: { initialValue?: INITIAL_VALUE } = {}
): Signal<T | INITIAL_VALUE> {
  const sig = signal<Suspense<T | INITIAL_VALUE>>(pending);

  effect(
    () => {
      fn()
        .pipe(suspensify())
        .subscribe((value) => sig.set(value));
    },
    { allowSignalWrites: true }
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