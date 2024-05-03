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
  template: ` <button (click)="selectMagicValue.emit(42)">CLICK</button>`,
})
export class OutputComponent {
  @Output() selectMagicValue = new EventEmitter<number>();
}
