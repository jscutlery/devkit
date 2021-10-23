import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import {
  FeatureToggleDirective,
  FeatureToggleModule,
} from './feature-flag.directive';
import {
  FEATURE_FLAGS,
  FeatureFlagService,
  Features,
} from './feature-flag.service';

@NgModule({
  imports: [CommonModule, FeatureToggleModule],
  exports: [FeatureToggleDirective],
})
export class FeatureFlagModule {
  static forRoot(
    featureFlags: Features
  ): ModuleWithProviders<FeatureFlagModule> {
    return {
      ngModule: FeatureFlagModule,
      providers: [
        {
          provide: FEATURE_FLAGS,
          useValue: featureFlags,
        },
        {
          provide: FeatureFlagService,
          useValue: new FeatureFlagService(featureFlags),
        },
      ],
    };
  }
}
