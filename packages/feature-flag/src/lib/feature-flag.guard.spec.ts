/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FeatureFlagGuard } from './feature-flag.guard';
import { FeatureFlagModule } from './feature-flag.module';

describe(FeatureFlagGuard.name, () => {
  let featureFlagGuard: FeatureFlagGuard;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: true },
      imports: [
        RouterTestingModule,
        FeatureFlagModule.forRoot({
          WEATHER: true,
          ADMIN: false,
        }),
      ],
      providers: [
        FeatureFlagGuard,
      ],
    }).compileComponents()
  });

  beforeEach(() => {
    featureFlagGuard = TestBed.inject(FeatureFlagGuard);
  });

  it('should navigate if feature is enabled', () => {
    expect(
      featureFlagGuard.canActivate({
        data: { feature: 'WEATHER' },
      } as any)
    ).toBe(true);
  });

  it('should not navigate if feature is disabled', () => {
    expect(
      featureFlagGuard.canActivate({
        data: { feature: 'ADMIN' },
      } as any)
    ).toBe(false);
  });

  it('should fallback to route path to check the feature is enabled', () => {
    expect(
      featureFlagGuard.canActivate({
        data: {},
        routeConfig: {
          path: 'WEATHER'
        }
      } as any)
    ).toBe(true);
  });

  it('should allow redirection', () => {
    expect(featureFlagGuard.canActivate({
      data: {
        feature: 'ADMIN',
        redirectTo: '/home'
      },
    } as any).toString()).toEqual('/home')
  });
});
