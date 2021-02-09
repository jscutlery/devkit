import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jc-sandbox-title',
  template: `<h1>🚀 Let's test!</h1>`,
})
export class TitleComponent {}

@NgModule({
  declarations: [TitleComponent],
  exports: [TitleComponent],
  imports: [CommonModule],
})
export class TitleModule {}
