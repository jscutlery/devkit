import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('swc-plugin-angular', () => {
  it('should load component with templateUrl & styleUrl', () => {
    const fixture = TestBed.createComponent(TestComponent);
    expect(fixture.nativeElement.textContent).toBe('Hello templateUrl!');
  });

  it('should pass inputs to children', () => {
    const fixture = TestBed.createComponent(TestInputsComponent);
    fixture.autoDetectChanges();
    expect(fixture.nativeElement.textContent).toBe('Hello inputs!');
  });
});

@Component({
  standalone: true,
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
})
class TestComponent {}

@Component({
  standalone: true,
  selector: 'lib-child',
  template: `<h1>{{ title() }}</h1>`,
})
class TitleComponent {
  title = input<string>();
}

@Component({
  standalone: true,
  imports: [TitleComponent],
  template: `<lib-child [title]="title" />`,
})
class TestInputsComponent {
  title = 'Hello inputs!';
}
