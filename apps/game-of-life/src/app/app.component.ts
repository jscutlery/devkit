import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GameOfLifeModule } from './game-of-life.component';

@Component({
  selector: 'jc-app',
  template: `<jc-game-of-life></jc-game-of-life>`,
})
export class AppComponent {}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, GameOfLifeModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
