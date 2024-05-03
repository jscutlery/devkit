import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'jc-output-legacy',
  template: ` <button (click)="selectMagicValue.emit(42)">CLICK</button>`,
})
export class OutputLegacyComponent {
  @Output() selectMagicValue = new EventEmitter<number>();
}
