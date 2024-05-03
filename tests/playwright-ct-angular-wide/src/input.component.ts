import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'jc-input',
  template: `<h1>{{ title() }}</h1>`,
})
export class InputComponent {
  title = input('');
}
