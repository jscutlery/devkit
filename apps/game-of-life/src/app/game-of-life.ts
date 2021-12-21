import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Service that simulates Conway's Game of Life.
 *
 * @todo make this more reactive and immutable.
 *
 * @author @kevcomedia
 * Source: https://github.com/kevcomedia/ng-game-of-life/blob/master/src/app/game-of-life.service.ts
 */
@Injectable({
  providedIn: 'root',
})
export class GameOfLife {
  rows = 10;
  cols = 10;

  private _cells: Cell[] = [];
  private _generationCount = 0;
  private _update$ = new BehaviorSubject<void>(undefined);

  get generationCount(): number {
    return this._generationCount;
  }

  /**
   * Initializes the grid with dead cells. This should be called prior to
   * calling any other function.
   * @param rows The number of rows. Defaults to 10.
   * @param cols The number of columns. Defaults to 10.
   */
  initialize(rows = this.rows, cols = this.cols) {
    const minDimension = 5;
    if (rows < minDimension || cols < minDimension) {
      throw Error(`Width and height must be at least ${minDimension}.`);
    }

    this.rows = rows;
    this.cols = cols;
    this._generationCount = 0;
    this._cells = Array.from({
      length: rows * cols,
    }).map((_, i, a) => new Cell(Math.floor(i / this.cols), i % this.cols));
  }

  /**
   * Makes a percentage of cells alive, depending on the input rate.
   * @param percentAlive The amount of cells that will become alive. A value of
   * `0.2` means 20% of the cells in the grid will become alive. This must be a
   * positive value not greater than 1. Defaults to 0.2.
   */
  randomizeCellStates(percentAlive = 0.2) {
    if (!this._cells) {
      throw Error('Grid has not yet been initialized.');
    }

    if (percentAlive < 0 || 1 < percentAlive) {
      throw Error(
        `percentAlive must be a number between 0 and 1, inclusive. Value: ${percentAlive}`
      );
    }

    this.reset();
    this._cells.forEach((cell) => {
      if (Math.random() < percentAlive) {
        cell.toggleState();
      }
    });
    // no need to update the previous states because we're starting from scratch anyway
  }

  /**
   * Gets all the cells as an array of arrays. Each subarray contains all
   * cells that share the same row, arranged by column number. The subarrays are
   * arranged by row number.
   */
  getGrid(): Cell[][] {
    if (!this._cells) {
      throw Error('Grid has not yet been initialized.');
    }

    const grid = [];
    for (let i = 0; i < this.rows; i++) {
      grid.push(this._cells.slice(i * this.cols, (i + 1) * this.cols));
    }
    return grid;
  }

  /**
   * Kills all cells and reverts the generation counter to 0.
   */
  reset() {
    if (!this._cells) {
      throw Error('Grid has not yet been initialized.');
    }

    this._cells.forEach((cell) => cell.reset());
    this._generationCount = 0;
  }

  /**
   * Advances the simulation to the next generation.
   */
  nextGeneration() {
    if (!this._cells) {
      throw Error('Grid has not yet been initialized.');
    }

    const alive = true; // better than a magic value

    this._cells.forEach((cell) => {
      const liveNeighborCount = this.getNeighborsOfCell(cell).filter((c) =>
        c.isAlive()
      ).length;

      switch (liveNeighborCount) {
        case 2: // cell retains status; do nothing
          break;
        case 3: // dead cell comes to life; live cells remain alive anyway
          cell.setTempState(alive);
          break;
        default:
          // live cell dies; dead cells remain dead
          cell.setTempState(!alive);
      }
    });
    this._generationCount++;
    this.updateCellStates();
    this._update$.next();
  }

  watchCell(row: number, col: number) {
    return this._update$.pipe(map(() => this.getCellAt({ row, col })));
  }

  /**
   * Updates all of the cell states with their new states. This should be called
   * after the new states have been computed.
   */
  private updateCellStates() {
    this._cells.forEach((cell) => cell.updateCurrentState());
  }

  /**
   * Gets all the cells that are adjacent to the input cell.
   * @param cell The cell whose neighbors we are interested with.
   */
  private getNeighborsOfCell(cell: Cell): Cell[] {
    if (this.isOutOfBounds(cell)) {
      throw Error('Cell coordinates are out of bounds.');
    }

    const { row, col } = cell;
    const possibleNeighborCoords = [
      { row: row - 1, col: col },
      { row: row - 1, col: col + 1 },
      { row: row, col: col + 1 },
      { row: row + 1, col: col + 1 },
      { row: row + 1, col: col },
      { row: row + 1, col: col - 1 },
      { row: row, col: col - 1 },
      { row: row - 1, col: col - 1 },
    ].filter((offset) => !this.isOutOfBounds(offset));

    return possibleNeighborCoords.map((coords) => this.getCellAt(coords));
  }

  /**
   * Gets the cell with the specified row and column numbers.
   * @param row The cell's row number.
   * @param col The cell's column number.
   */
  private getCellAt({ row = 0, col = 0 } = {}): Cell {
    if (this.isOutOfBounds({ row, col })) {
      throw Error(
        `Cell coordinates are out of bounds. Bounds: ${this.rows} rows, ${
          this.cols
        } cols. Value: ${{ row, col }}`
      );
    }

    return this._cells[row * this.cols + col];
  }

  /**
   * Returns true if the supplied coords are outside the bounds of the grid.
   * @param param0 The coordinates we want to check.
   */
  private isOutOfBounds({ row, col }: { row: number; col: number }): boolean {
    return this.isRowOutOfBounds(row) || this.isColOutOfBounds(col);
  }

  private isRowOutOfBounds(row: number) {
    return row < 0 || this.rows <= row;
  }

  private isColOutOfBounds(col: number) {
    return col < 0 || this.cols <= col;
  }
}

/**
 * Represents a cell in the Game of Life.
 */
export class Cell {
  // The actual state of the cell.
  private currentState = false;
  // This is where the cell's new state will be stored after
  // computing the next generation.
  private tempState = false;
  private _row: number;
  private _col: number;

  // The dead state will be represented by `false`.
  // The live state by `true`.
  constructor(row: number, col: number) {
    this._row = row;
    this._col = col;
  }

  get row(): number {
    return this._row;
  }

  get col(): number {
    return this._col;
  }

  setTempState(state: boolean) {
    this.tempState = state;
  }

  toggleState() {
    this.tempState = !this.tempState;
    this.updateCurrentState();
  }

  updateCurrentState() {
    this.currentState = this.tempState;
  }

  isAlive(): boolean {
    return this.currentState;
  }

  reset() {
    this.currentState = this.tempState = false;
  }
}
