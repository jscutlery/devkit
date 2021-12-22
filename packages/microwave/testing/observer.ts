import { Observable, PartialObserver, Subscription } from 'rxjs';

export function createObserver() {
  let subscription: Subscription;

  beforeEach(() => (subscription = new Subscription()));
  afterEach(() => subscription.unsubscribe());

  return {
    observe<T>(observable: Observable<T>) {
      const observer: PartialObserver<T> = {
        next: jest.fn<void, [T]>(),
        error: jest.fn<void, [unknown]>(),
        complete: jest.fn<void, []>(),
      };
      subscription.add(observable.subscribe(observer));
      return observer;
    },
  };
}
