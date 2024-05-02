import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'jc-basic',
  template: `<h1>Hello world!</h1>`,
})
export class BasicComponent {}
