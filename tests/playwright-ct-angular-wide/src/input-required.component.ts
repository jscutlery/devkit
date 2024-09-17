import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'jc-required-input',
  template: `<h1>{{ title() }}</h1>`,
})
export class InputRequiredComponent {
  title = input.required<string>();
}
