import {
  ChangeDetectionStrategy,
  Component,
  inject,
  InjectionToken,
} from '@angular/core';

export const TOKEN = new InjectionToken<{ value: number }>('token');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'jc-hooks',
  template: `{{ value }}`,
})
export class HooksComponent {
  value = inject(TOKEN).value;
}
