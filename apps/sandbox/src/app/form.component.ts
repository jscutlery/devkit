import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';

@Component({
  selector: 'jc-sandbox-form',
  template: `
    <form>
      <mat-form-field>
        <input matInput placeholder="label 1" />
      </mat-form-field>
      <mat-form-field>
        <input matInput placeholder="label 2" />
      </mat-form-field>
    </form>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {}

@NgModule({
  imports: [CommonModule, MatFormFieldModule],
  declarations: [FormComponent],
  exports: [FormComponent],
})
export class FormModule {}
