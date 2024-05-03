import { DOCUMENT } from '@angular/common';
import { Component, Output, inject } from '@angular/core';
import { Subject, finalize } from 'rxjs';

@Component({
  standalone: true,
  template: `OutputUnsubscriptionComponent`,
})
export class OutputUnsubscriptionComponent {
  @Output() selectMagicValue = new Subject().pipe(
    /* Detect when observable is unsubscribed from,
     * and set a global variable `hasUnsubscribed` to true. */
    finalize(() => ((this._window as any).hasUnsubscribed = true)),
  );

  private _window = inject(DOCUMENT).defaultView;
}
