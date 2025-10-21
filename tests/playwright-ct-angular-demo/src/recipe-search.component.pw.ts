import {
  ComponentFixtures,
  expect,
  test,
} from '@jscutlery/playwright-ct-angular';
import { RecipeSearchTestContainer } from './recipe-search.test-container';

test.describe('<wm-recipe-search>', () => {
  test('should search recipes without keyword on load', async ({
    page,
    mount,
  }) => {
    const { recipeTitleLocator } = await renderSearchComponent({ mount });

    await expect(recipeTitleLocator).toHaveText(['Beer', 'Burger']);

    /* Prefer using whole page screenshot for two reasons:
     * 1. it's the same resolution and the Playwright reporter diff will show slider.
     * 2. we make sure that there's no extra overlay in the DOM (e.g. dialog). */
    await expect(page).toHaveScreenshot(`all recipes.png`, {
      maxDiffPixelRatio: 0.3,
    });
  });

  test('should search recipes using given filter', async ({ mount }) => {
    const { recipeTitleLocator, updateFilter } = await renderSearchComponent({
      mount,
    });

    await updateFilter({
      keywords: 'Bur',
    });

    await expect(recipeTitleLocator).toHaveText(['Burger']);
  });

  async function renderSearchComponent({ mount }: ComponentFixtures) {
    const locator = await mount(RecipeSearchTestContainer);

    return {
      recipeTitleLocator: locator.getByTestId('recipe-name'),
      async updateFilter({ keywords }: { keywords: string }) {
        await locator.getByLabel('Keywords').fill(keywords);
      },
    };
  }
});
