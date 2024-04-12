import { Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'jsc-title',
  templateUrl: './title.component.html'
})
export class TitleComponent {
  title = input.required<string>();
}
