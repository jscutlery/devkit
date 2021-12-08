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
export class HelloDIComponent {
  title: string;
  constructor(appInfo: AppInfo) {
    this.title = appInfo.title;
  }
}

@NgModule({
  declarations: [HelloDIComponent],
})
export class HelloDIModule {}
