import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'jc-child',
  template: `{{ message() }}`,
})
export class ChildComponent {
  message = input.required<string>();
}
