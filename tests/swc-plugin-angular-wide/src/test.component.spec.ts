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

    const body = fixture.nativeElement.querySelector('p');
    expect(body.textContent).toBe('Hello body!');
  });

  it('should pass required inputs to children', () => {
    const fixture = TestBed.createComponent(TestInputsComponent);
    fixture.autoDetectChanges();

    const title = fixture.nativeElement.querySelector('h1');
    expect(title.textContent).toBe('Hello title!');
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
  template: `
    <h1>{{ title() }}</h1>
    <p>{{ body() }}</p>
  `,
})
class TitleComponent {
  title = input.required<string>();
  body = input<string>();
}

@Component({
  standalone: true,
  imports: [TitleComponent],
  template: `<lib-child [title]="title" [body]="body" />`,
})
class TestInputsComponent {
  title = 'Hello title!';
  body = 'Hello body!';
}
