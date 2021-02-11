import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';

@Component({
  selector: 'jc-hello',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1>Hello {{ name }}</h1>`,
})
export class HelloComponent {
  @Input() name: string;
}

@NgModule({
  declarations: [HelloComponent],
  exports: [HelloComponent],
  imports: [CommonModule],
})
export class HelloModule {}
