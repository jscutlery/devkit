import {
  Directive,
  Input,
  NgModule,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { FeatureFlagService } from './feature-flag.service';

@Directive({
  selector: '[jscFeatureToggle]',
})
export class FeatureToggleDirective implements OnInit {
  @Input()
  jscFeatureToggle = '';

  constructor(
    private featureFlag: FeatureFlagService,
    private templateRef: TemplateRef<unknown>,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    if (this.featureFlag.isEnabled(this.jscFeatureToggle)) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}

@NgModule({
  declarations: [FeatureToggleDirective],
  exports: [FeatureToggleDirective],
})
export class FeatureToggleModule {}
