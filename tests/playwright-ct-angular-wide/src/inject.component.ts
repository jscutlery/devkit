import {
  ChangeDetectionStrategy,
  Component,
  inject,
  InjectionToken,
} from '@angular/core';

export const TOKEN = new InjectionToken<{ value: string }>('token');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'jc-inject',
  template: `{{ value }}`,
})
export class InjectComponent {
  value = inject(TOKEN).value;
}
