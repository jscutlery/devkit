import {
  ChangeDetectionStrategy,
  Component,
  input,
  Input,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'jc-input-signal',
  template: `<h1>{{ title() }}</h1>`,
})
export class InputSignalComponent {
  title = input('');
}
