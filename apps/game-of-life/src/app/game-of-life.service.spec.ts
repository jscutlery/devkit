import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { GameOfLife, range } from './game-of-life.service';

describe(GameOfLife.name, () => {
  it('should compute next generation', async () => {
    const { gameOfLife, setAliveCells, getActiveCells } = setUp();

    setAliveCells([50, 149, 150, 151]);

    gameOfLife.nextGeneration();

    expect(await getActiveCells()).toEqual([49, 50, 51, 149, 150, 151, 250]);
  });

  function setUp() {
    const gameOfLife = TestBed.inject(GameOfLife);
    const cols = 100;
    const rows = 100;

    return {
      gameOfLife,
      setAliveCells(aliveCells: number[]) {
        const cells = range(rows * cols).map((i) => aliveCells.includes(i));

        gameOfLife.reset({
          cols,
          rows,
          cells,
        });
      },
      async getActiveCells() {
        const cells = await firstValueFrom(gameOfLife.cells$);
        return cells.reduce((activeCells, isActive, index) => {
          return isActive ? [...activeCells, index] : activeCells;
        }, [] as number[]);
      },
    };
  }
});
