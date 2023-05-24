import { effect, signal, Signal } from '@angular/core';
import { Observable } from 'rxjs';

export function rxComputed<T>(
  fn: () => Observable<T>
): Signal<T | undefined> {
  const sig = signal<T | undefined>(undefined);

  effect(
    () => {
      fn()
        .subscribe((value) => sig.set(value));
    },
    { allowSignalWrites: true }
  );

  return sig;
}