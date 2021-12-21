import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { GameOfLife } from './game-of-life';

@Component({
  selector: 'jc-cell',
  template: `<div class="content" [style.backgroundColor]="color"></div>`,
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
  @Input() col?: number;
  @Input() row?: number;

  color?: string;

  constructor(private _gol: GameOfLife) {}

  ngOnInit() {
    if (this.row == null || this.col == null) {
      throw new Error(`${CellComponent.name} col or row inputs are missing`);
    }

    this._gol.watchCell(this.row, this.col).subscribe((cell) => {
      this.color = cell.isAlive() ? '#380030' : '#ffffff';
    });
  }
}

@NgModule({
  declarations: [CellComponent],
  exports: [CellComponent],
  imports: [CommonModule],
})
export class CellModule {}
