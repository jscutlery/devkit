import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  NgModule,
  OnInit,
} from '@angular/core';
import { Microwave, syncStrategy } from '@jscutlery/microwave';
import { GameOfLife } from './game-of-life.service';

@Microwave({
  strategy: syncStrategy,
})
@Component({
  selector: 'jc-cell',
  template: `<div class="content" [style.backgroundColor]="getColor()"></div>`,
  styles: [
    `
      :host {
        border-color: #380030;
        border-style: solid;
        border-width: 1px;
      }

      .content {
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class CellComponent implements OnInit {
  @Input() col?: number = undefined;
  @Input() row?: number = undefined;

  color?: string = undefined;

  constructor(private _gol: GameOfLife, private _cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.row == null || this.col == null) {
      throw new Error(`${CellComponent.name} col or row inputs are missing`);
    }

    this._gol.isAlive({ col: this.col, row: this.row }).subscribe((isAlive) => {
      this.color = isAlive ? '#380030' : '#ffffff';
    });
  }

  /* Using a method + console.debug
   * to slow down change detection. */
  getColor() {
    // eslint-disable-next-line no-restricted-syntax
    console.debug('getColor');
    return this.color;
  }
}

@NgModule({
  declarations: [CellComponent],
  exports: [CellComponent],
  imports: [CommonModule],
})
export class CellModule {}
