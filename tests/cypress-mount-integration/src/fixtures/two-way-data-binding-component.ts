import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'jc-two-way-data-binding',
  template: `<input [(ngModel)]="value" />
    <p class="value">{{ value }}</p>`,
})
export class TwoWayDataBindingComponent {
  @Input() value = '';
}

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [TwoWayDataBindingComponent],
  exports: [TwoWayDataBindingComponent],
})
export class TwoWayDataBindingModule {}
