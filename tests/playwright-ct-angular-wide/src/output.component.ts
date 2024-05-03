import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'jc-output',
  template: ` <button (click)="action.emit(42)">CLICK</button>`,
})
export class OutputComponent {
  @Output() action = new EventEmitter<number>();
}
