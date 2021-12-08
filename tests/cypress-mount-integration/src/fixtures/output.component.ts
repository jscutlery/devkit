import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'jc-output',
  template: `
    <button type="button" (click)="output.emit('hello')">Click</button>
  `,
})
export class OutputComponent {
  @Output() output = new EventEmitter<any>();
}
