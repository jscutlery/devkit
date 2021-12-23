import { TestBed } from '@angular/core/testing';
import { GameOfLife, range } from './game-of-life.service';
describe(GameOfLife.name, () => {
  xit('🚧 should compute next generation', async () => {
    const { gameOfLife, act } = setUp();

    act();

    // const cells = await lastValueFrom(gameOfLife.cells$);

    // expect(cells).toEqual([
    //   /* @todo */
    // ]);
  });

  function setUp() {
    const gameOfLife = TestBed.inject(GameOfLife);
    const cols = 100;
    const rows = 100;

    const aliveCells = [50, 149, 150, 151];
    const cells = range(rows * cols).map((i) => aliveCells.includes(i));

    gameOfLife.resetV2({
      cols,
      rows,
      cells,
    });

    return {
      gameOfLife,
      act() {
        gameOfLife.nextGeneration();
      },
    };
  }
});
