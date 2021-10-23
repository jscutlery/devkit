import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { FeatureFlagService } from './feature-flag.service';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagGuard implements CanActivate {
  constructor(
    private readonly featureFlag: FeatureFlagService,
    private readonly router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const feature = route.data.feature ?? route.routeConfig?.path;
    const redirectTo = route.data.redirectTo;

    if (this.featureFlag.isEnabled(feature)) {
      return true;
    }

    if (redirectTo) {
      return this.router.parseUrl(route.data.redirectTo);
    }

    return false;
  }
}
