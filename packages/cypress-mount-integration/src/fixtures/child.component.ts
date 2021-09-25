import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'jc-child',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1>Child {{ name }}</h1>`,
})
export class ParentComponent {
  @Input() name: string;
}

@Component({
  selector: 'jc-parent',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1>Parent</h1>
    <ng-content></ng-content>`,
})
export class ChildComponent {}
