import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormModule } from './form.component';
import { TitleModule } from './title.component';

@Component({
  selector: 'jc-sandbox-app',
  template: `
    <jc-sandbox-title></jc-sandbox-title>
    <jc-sandbox-form></jc-sandbox-form>
  `,
  standalone: false,
})
export class AppComponent {}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, TitleModule, FormModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
