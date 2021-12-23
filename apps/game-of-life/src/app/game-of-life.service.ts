import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged, map } from 'rxjs';

/**
 * Service that simulates Conway's Game of Life.
 *
 * Inspired from the work of @kevcomedia
 * Source: https://github.com/kevcomedia/ng-game-of-life/blob/master/src/app/game-of-life.service.ts
 */
@Injectable({
  providedIn: 'root',
})
export class GameOfLife {
  cells$: Observable<boolean[]>;

  private _cols = 10;
  private _rows = 10;
  private _cells$: BehaviorSubject<boolean[]>;
  /* An optomization set containing the cells to process on next generation. */
  private _cellIndexesToProcess?: Set<number>;

  constructor() {
    this._cells$ = new BehaviorSubject(
      this._generateCells({ cols: this._cols, rows: this._rows })
    );
    this.cells$ = this._cells$.asObservable();
  }

  /**
   * Advances the simulation to the next generation.
   */
  nextGeneration() {
    const cells = this._cells$.value;
    const newCells = [...cells];
    const newCellIndexesToProcess = new Set<number>();

    /* On first generation, all cells must be processed. */
    for (const index of this._cellIndexesToProcess ?? new Set(cells.keys())) {
      const { isAlive, neighborsIndexes } = this._processCellNextGeneration(
        cells,
        index
      );

      /* Update cell state. */
      newCells[index] = isAlive;

      /* Mark cell and neighboors to be processed on next generation. */
      if (isAlive) {
        newCellIndexesToProcess.add(index);
        neighborsIndexes.forEach((_index) =>
          newCellIndexesToProcess.add(_index)
        );
      }
    }

    this._cellIndexesToProcess = newCellIndexesToProcess;
    this._updateCells(newCells);
  }

  isAlive({ col, row }: { col: number; row: number }) {
    return this._cells$.pipe(
      map((cells) => cells[this._getIndex({ col, row })]),
      distinctUntilChanged()
    );
  }

  reset(
    args: { cols: number; rows: number } & (
      | { cells: boolean[] }
      | { percentAlive?: number }
    )
  ) {
    this._updateCells(this._generateCells(args));
    /* Reset optimization set. */
    this._cellIndexesToProcess = undefined;
  }

  private _generateCells({
    cols,
    rows,
    ...args
  }: { cols: number; rows: number } & (
    | { cells: boolean[] }
    | { percentAlive?: number }
  )) {
    this._cols = cols;
    this._rows = rows;

    if ('cells' in args) {
      if (args.cells.length !== cols * rows) {
        throw new Error(
          `Invalid cell count: ${args.cells.length} should be equal to cols=${cols} x rows=${rows}`
        );
      }

      return args.cells;
    } else {
      return this._generateRandomCells(args.percentAlive);
    }
  }

  private _generateRandomCells(percentAlive = 0.2): boolean[] {
    if (percentAlive < 0 || 1 < percentAlive) {
      throw Error(
        `percentAlive must be a number between 0 and 1, inclusive. Value: ${percentAlive}`
      );
    }

    return range(this._cols * this._rows).map(
      () => Math.random() < percentAlive
    );
  }

  private _processCellNextGeneration(cells: boolean[], index: number) {
    let isAlive = cells[index];
    const { col, row } = this._getCoords(index);

    /* This might contain -1 if out of range
     * -1 doesn't exist so it will return undefined
     * and it will be considered dead. */
    const neighborsIndexes = [
      this._getIndex({ col: col - 1, row: row - 1 }),
      this._getIndex({ col: col - 1, row }),
      this._getIndex({ col: col - 1, row: row + 1 }),
      this._getIndex({ col, row: row - 1 }),
      this._getIndex({ col, row: row + 1 }),
      this._getIndex({ col: col + 1, row: row - 1 }),
      this._getIndex({ col: col + 1, row }),
      this._getIndex({ col: col + 1, row: row + 1 }),
    ];

    /* Using a for loop to break when we decide to kill the cell. */
    let aliveNeighborsCount = 0;
    for (const neighborIndex of neighborsIndexes) {
      if (cells[neighborIndex]) {
        ++aliveNeighborsCount;
      }

      if (aliveNeighborsCount === 3) {
        isAlive = true;
      }

      if (aliveNeighborsCount === 4) {
        isAlive = false;
        break;
      }
    }

    if (aliveNeighborsCount <= 1) {
      isAlive = false;
    }

    return { isAlive, neighborsIndexes };
  }

  private _updateCells(cells: boolean[]) {
    this._cells$.next(cells);
  }

  private _getCoords(index: number) {
    return {
      col: index % this._cols,
      row: Math.floor(index / this._cols),
    };
  }

  /**
   * @returns -1 if out of range
   */
  private _getIndex({ col, row }: { col: number; row: number }) {
    if (row < 0 || row >= this._rows || col < 0 || col >= this._cols) {
      return -1;
    }
    return row * this._cols + col;
  }
}

export function range(length: number) {
  return [...Array(length).keys()];
}
