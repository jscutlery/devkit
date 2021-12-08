import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jc-counter',
  template: ` <button (click)="increment()" data-role="increment">👍🏾</button>
    <span data-role="value">{{ counter$ | async }}</span>
    <button (click)="decrement()" data-role="decrement">👎🏾</button>`,
  styles: [
    `
      :host {
        display: block;
        text-align: center;
        font-size: 5em;
      }

      button {
        background: none;
        border: 0;
        font-size: 1em;
      }
    `,
  ],
})
export class CounterComponent {
  counter$ = new BehaviorSubject(0);
  increment() {
    this.counter$.next(this.counter$.value + 1);
  }
  decrement() {
    this.counter$.next(this.counter$.value - 1);
  }
}

@NgModule({
  declarations: [CounterComponent],
  exports: [CounterComponent],
  imports: [CommonModule],
})
export class CounterModule {}
