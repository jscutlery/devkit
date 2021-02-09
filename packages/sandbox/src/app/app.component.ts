import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TitleModule } from './title.component';

@Component({
  selector: 'jc-sandbox-app',
  template: `<jc-sandbox-title></jc-sandbox-title>`,
})
export class AppComponent {}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, TitleModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
