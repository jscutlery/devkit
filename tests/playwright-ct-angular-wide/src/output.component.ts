import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'jc-output',
  template: ` <button (click)="selectMagicValue.emit(42)">CLICK</button>`,
})
export class OutputComponent {
  selectMagicValue = output<number>();
}
