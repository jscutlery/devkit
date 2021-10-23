import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FeatureToggleDirective } from './feature-flag.directive';
import { FeatureFlagModule } from './feature-flag.module';

@Component({
  selector: 'jsc-test',
  template: `
    <div class="weather" *jscFeatureToggle="'WEATHER'">weather</div>
    <div class="admin" *jscFeatureToggle="'ADMIN'">admin</div>
  `,
})
export class TestComponent {}

describe(FeatureToggleDirective.name, () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [
        FeatureFlagModule.forRoot({
          WEATHER: true,
          ADMIN: false,
        }),
      ],
      teardown: { destroyAfterEach: true },
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should display enabled feature', () => {
    expect(fixture.debugElement.query(By.css('.weather'))).not.toBeNull();
    expect(
      fixture.debugElement.query(By.css('.weather')).nativeElement.textContent
    ).toBe('weather');
  });

  it('should not display disabled feature', () => {
    expect(fixture.debugElement.query(By.css('.admin'))).toBeNull();
  });
});
