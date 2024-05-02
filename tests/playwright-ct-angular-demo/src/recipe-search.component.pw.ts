import {
  ComponentFixtures,
  expect,
  test,
} from '@jscutlery/playwright-ct-angular';
import { RecipeSearchTestContainer } from './recipe-search.test-container';
import { recipeMother } from './testing/recipe.mother';

test.describe('<wm-recipe-search>', () => {
  test('should search recipes without keyword on load', async ({ mount }) => {
    const { recipeTitleLocator, verifyScreenshot } =
      await renderSearchComponent({ mount });

    await expect(recipeTitleLocator).toHaveText(['Beer', 'Burger']);

    await verifyScreenshot('all recipes');
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
    const locator = await mount(RecipeSearchTestContainer, {
      props: {
        recipes: [
          recipeMother.withBasicInfo('Beer').build(),
          recipeMother.withBasicInfo('Burger').build(),
        ],
      },
    });

    return {
      recipeTitleLocator: locator.getByTestId('recipe-name'),
      async updateFilter({ keywords }: { keywords: string }) {
        await locator.getByLabel('Keywords').type(keywords);
      },
      async verifyScreenshot(name: string) {
        /* Wait for images to load. */
        await locator.page().waitForLoadState('networkidle');

        /* For some reason, Firefox reaches here while all images didn't load yet.
         * Keep trying until it succeeds. */
        await expect(async () => {
          /* Prefer using whole page screenshot for two reasons:
           * 1. it's the same resolution and the Playwright reporter diff will show slider.
           * 2. we make sure that there's no extra overlay in the DOM (e.g. dialog). */
          await expect(locator.page()).toHaveScreenshot(`${name}.png`);
        }).toPass();
      },
    };
  }
});
