import { ComponentFixtures, expect, test } from '@jscutlery/playwright-ct-angular';
import { RecipeFilterComponent } from './recipe-filter.component';

test.describe('<wm-recipe-filter>', () => {
  test('should search recipes without keyword on load', async ({ mount }) => {
    const { filterChangeSpy, updateFilter } = await renderRecipeFilter({ mount });

    await updateFilter({ keywords: 'Burger' });

    expect(filterChangeSpy).toBeCalledTimes(6);
    expect(filterChangeSpy).lastCalledWith(
      expect.objectContaining({
        keywords: 'Burger'
      })
    );
  });

  async function renderRecipeFilter({ mount }: ComponentFixtures) {
    const locator = await mount(RecipeFilterComponent, {
      spyOutputs: ['filterChange']
    });

    return {
      filterChangeSpy: locator.spies.filterChange,
      async updateFilter({ keywords }: { keywords: string }) {
        await locator.getByLabel('Keywords').type(keywords);
      }
    };
  }
});
