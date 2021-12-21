import { CommonModule } from '@angular/common';
import { Component, HostBinding, NgModule, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { CellModule } from './cell.component';
import { GameOfLife } from './game-of-life';

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
export class GameOfLifeComponent implements OnDestroy {
  colCount = 50;
  rowCount = 50;
  rows = range(this.colCount);
  cols = range(this.rowCount);
  gridTemplateColumns = `repeat(${this.colCount}, 1fr)`;
  gridTemplateRows = `repeat(${this.rowCount}, 1fr)`;

  private _subscription = new Subscription();

  constructor(private _gol: GameOfLife) {
    this._gol.initialize(this.rowCount, this.colCount);
    this._gol.randomizeCellStates(0.1);
    this._subscription.add(
      interval(10).subscribe(() => this._gol.nextGeneration())
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe;
  }

  reset() {
    this._gol.randomizeCellStates();
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
