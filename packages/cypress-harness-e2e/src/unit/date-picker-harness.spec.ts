import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCalendarHarness, MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { getAllHarnesses, getHarness } from '@jscutlery/cypress-harness';
import { initEnv, mount, setConfig } from 'cypress-angular-unit-test/dist';

@Component({
  template: `<mat-form-field>
    <input matInput [matDatepicker]="picker" [formControl]="control" />
    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
    <mat-datepicker #picker></mat-datepicker>
  </mat-form-field>`,

})
export class TestedComponent {
  control = new FormControl()
}

describe('cypress-harness', () => {
  const datepicker = MatDatepickerInputHarness;

  beforeEach(() => {
    setConfig({
      detectChanges: true,
      style: require('!css-loader!@angular/material/prebuilt-themes/deeppurple-amber.css').toString(),
    });
    initEnv(TestedComponent, {
      imports: [
        BrowserAnimationsModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,
        ReactiveFormsModule
      ],
    });
    mount(TestedComponent);
  });

  it('should set date using material datepicker harness', () => {
    getHarness(datepicker).invoke('setValue', '1/1/2010');
    getHarness(datepicker).invoke('openCalendar');
    getHarness(datepicker).invoke('getCalendar').invoke('next');
    getHarness(datepicker)
      .invoke('getCalendar')
      .invoke('selectCell', { text: '10' });
    getHarness(datepicker).invoke('getValue').should('equal', '2/10/2010');
    getAllHarnesses(MatCalendarHarness).should('be.empty');
  });
});
