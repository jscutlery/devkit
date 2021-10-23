import { Inject, Injectable, InjectionToken } from '@angular/core';

export interface Features {
  [feature: string]: boolean;
}

export const FEATURE_FLAGS = new InjectionToken<Features>('FEATURE_FLAGS');

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService {
  private readonly featureFlags = new Map<string, boolean>();

  constructor(@Inject(FEATURE_FLAGS) readonly features: Features = {}) {
    this.configure(features);
  }

  list(): Features {
    return Object.entries(this.featureFlags).reduce(
      (features, [feature, enabled]: [string, boolean]) => ({
        ...features,
        [feature]: enabled,
      }),
      {}
    );
  }

  set(feature: string, enabled: boolean): void {
    this.featureFlags.set(feature, enabled);
  }

  isEnabled(feature: string): boolean {
    return this.featureFlags.get(feature) ?? false;
  }

  private configure(featureFlags: Features): void {
    Object.entries(featureFlags).forEach(([feature, state]) =>
      this.featureFlags.set(feature, state)
    );
  }
}
