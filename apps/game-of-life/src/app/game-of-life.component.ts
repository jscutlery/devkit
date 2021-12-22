import { CommonModule } from '@angular/common';
import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { Microwave } from '@jscutlery/microwave';
import { Subscription } from 'rxjs';
import { CellModule } from './cell.component';
import { GameOfLife } from './game-of-life';

@Microwave()
@Component({
  selector: 'jc-game-of-life',
  template: `
    <section
      class="grid"
      [style.gridTemplateColumns]="gridTemplateColumns"
      [style.gridTemplateRows]="gridTemplateRows"
    >
      <ng-container *ngFor="let rowIndex of rows">
        <jc-cell
          *ngFor="let colIndex of cols"
          [col]="colIndex"
          [row]="rowIndex"
        ></jc-cell>
      </ng-container>
    </section>
    <button class="button" (click)="reset()">RESET</button>
  `,
  styles: [
    `
      .grid {
        display: grid;
        height: calc(100vh - 100px);
      }

      .button {
        display: block;
        margin: auto;
      }
    `,
  ],
})
export class GameOfLifeComponent implements OnDestroy, OnInit {
  colCount = 40;
  rowCount = 40;
  rows = range(this.colCount);
  cols = range(this.rowCount);
  gridTemplateColumns = `repeat(${this.colCount}, 1fr)`;
  gridTemplateRows = `repeat(${this.rowCount}, 1fr)`;

  private _subscription = new Subscription();

  constructor(private _gol: GameOfLife) {
    this._gol.initialize(this.rowCount, this.colCount);
  }

  async ngOnInit() {
    this.reset();

    /* Using a loop to handle backpressure. */
    // eslint-disable-next-line no-constant-condition
    while (true) {
      await new Promise((resolve) => setTimeout(resolve));

      this._gol.nextGeneration();
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe;
  }

  reset() {
    this._gol.randomizeCellStates(0.1);
  }
}

function range(count: number): Array<number> {
  return Array.from(Array(count).keys());
}

@NgModule({
  declarations: [GameOfLifeComponent],
  exports: [GameOfLifeComponent],
  imports: [CellModule, CommonModule],
})
export class GameOfLifeModule {}
