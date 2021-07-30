import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatInputHarness } from '@angular/material/input/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { getAllHarnesses } from '@jscutlery/cypress-harness';
import { mount } from '@jscutlery/cypress-mount';

@Component({
  template: `
    <form [formGroup]="form">
      <mat-form-field>
        <input matInput formControlName="controlA" />
      </mat-form-field>
      <mat-form-field>
        <input matInput formControlName="controlB" />
      </mat-form-field>
    </form>
  `,
})
export class TestedComponent {
  form = new FormGroup({
    controlA: new FormControl(),
    controlB: new FormControl(),
  });
}

@NgModule({
  declarations: [TestedComponent],
  imports: [BrowserAnimationsModule, MatInputModule, ReactiveFormsModule],
})
export class TestedModule {}

describe(getAllHarnesses.name, () => {
  beforeEach(() =>
    mount(TestedComponent, {
      styles: [
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('!css-loader!@angular/material/prebuilt-themes/deeppurple-amber.css').toString(),
      ],
      imports: [TestedModule],
    })
  );

  it('should set input value using material input harness', () => {
    getAllHarnesses(MatInputHarness).then(async ([controlA, controlB]) => {
      await controlA.setValue('value A');
      await controlB.setValue('value B');

      expect(await controlA.getValue()).to.equal('value A');
      expect(await controlB.getValue()).to.equal('value B');
    });
  });
});
