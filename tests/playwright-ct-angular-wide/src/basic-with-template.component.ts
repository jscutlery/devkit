import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'jc-basic-with-template',
  templateUrl: './basic-with-template.component.html',
})
export class BasicWithTemplateComponent {}
