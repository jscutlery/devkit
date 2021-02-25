import { Component, NgModule } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatCalendarHarness,
  MatDatepickerInputHarness,
} from '@angular/material/datepicker/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { getAllHarnesses, getHarness } from '@jscutlery/cypress-harness';
import { mount } from '@jscutlery/cypress-mount';

@Component({
  template: `<mat-form-field>
    <input matInput [matDatepicker]="picker" [formControl]="control" />
    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
    <mat-datepicker #picker></mat-datepicker>
  </mat-form-field>`,
})
export class TestedComponent {
  control = new FormControl();
}

@NgModule({
  declarations: [TestedComponent],
  imports: [
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
})
export class TestedModule {}

describe('cypress-harness', () => {
  beforeEach(() =>
    mount(TestedComponent, {
      styles: [
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('!css-loader!@angular/material/prebuilt-themes/deeppurple-amber.css').default.toString(),
      ],
      imports: [TestedModule],
    })
  );

  it('should set date using material datepicker harness', () => {
    /* getHarness is lazy so we can share the same reference. */
    const datepicker = getHarness(MatDatepickerInputHarness);

    /* getAllHarnesses is lazy so we can instanciate it here and use it later. */
    const calendars = getAllHarnesses(MatCalendarHarness);

    datepicker.setValue('1/1/2010');
    datepicker.openCalendar();
    datepicker.getCalendar().invoke('next');
    datepicker.getCalendar().selectCell({ text: '10' });
    datepicker.getValue().should('equal', '2/10/2010');

    calendars.should('be.empty');
  });
});
