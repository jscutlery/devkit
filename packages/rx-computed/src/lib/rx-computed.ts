import { effect, signal, Signal } from '@angular/core';
import { Observable } from 'rxjs';

export function rxComputed<T, INITIAL_VALUE = T | null | undefined>(
  fn: () => Observable<T>,
  { initialValue }: { initialValue?: INITIAL_VALUE } = {}
): Signal<T | INITIAL_VALUE> {
  const sig = signal<T | INITIAL_VALUE>(initialValue as INITIAL_VALUE);

  effect(
    () => {
      fn()
        .subscribe((value) => sig.set(value));
    },
    { allowSignalWrites: true }
  );

  return sig;
}