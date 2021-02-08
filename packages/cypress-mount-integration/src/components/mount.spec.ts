import { setupAndMount } from '@jscutlery/cypress-mount';

import { Component, Injectable, NgModule } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppInfo {
  title = 'JSCutlery';
}

@Component({
  template: `{{ title }}`,
})
export class AppTitleComponent {
  title: string;
  constructor(appInfo: AppInfo) {
    this.title = appInfo.title;
  }
}

@NgModule({
  declarations: [AppTitleComponent],
})
export class AppTitleModule {}

describe('mount', () => {
  it('should not break dependency injection', () => {
    setupAndMount(AppTitleComponent, {
      imports: [AppTitleModule],
    });
    cy.contains('JSCutlery');
  });
});
