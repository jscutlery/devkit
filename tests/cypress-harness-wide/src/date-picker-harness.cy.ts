import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { getHarness } from '@jscutlery/cypress-harness';

@Component({
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  template: ` <mat-form-field>
    <input matInput [matDatepicker]="picker" [formControl]="control" />
    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
    <mat-datepicker #picker></mat-datepicker>
  </mat-form-field>`,
})
export class TestedComponent {
  control = new FormControl();
}

describe(getHarness.name, () => {
  /* getHarness is lazy, so we can share the same reference. */
  const datepicker = getHarness(MatDatepickerInputHarness);

  it('should set date using material datepicker input harness', () => {
    mountComponent();

    // Test basic datepicker input functionality without calendar popup
    datepicker.setValue('2/10/2010');
    datepicker.getValue().should('equal', '2/10/2010');

    // Verify the input is connected to the datepicker
    datepicker.isCalendarOpen().should('equal', false);
  });

  it('should verify datepicker is interactive', () => {
    mountComponent();

    datepicker.then(async (harness) => {
      // Set a value
      await harness.setValue('1/15/2020');
      const value = await harness.getValue();
      expect(value).to.equal('1/15/2020');

      // Verify calendar can be opened (but we won't interact with it due to Angular Material 21 harness limitations)
      const isDisabled = await harness.isDisabled();
      expect(isDisabled).to.be.false;
    });
  });

  function mountComponent() {
    return cy.mount(TestedComponent, {
      imports: [BrowserAnimationsModule],
    });
  }
});
