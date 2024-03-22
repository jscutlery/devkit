import { TestBed } from '@angular/core/testing';
import { TestComponent } from './test.component';

describe(TestComponent.name, () => {
  it('should display hello', () => {
    const fixture = TestBed.createComponent(TestComponent);
    expect(fixture.nativeElement.textContent).toBe('Test works!');
  });
});
