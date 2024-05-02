import {
  ComponentFixtures,
  expect,
  test,
} from '@jscutlery/playwright-ct-angular';
import { RecipeFilter } from './recipe-filter';
import { RecipeFilterComponent } from './recipe-filter.component';

test.describe('<wm-recipe-filter>', () => {
  test('should search recipes without keyword on load', async ({ mount }) => {
    const { filterChangeCalls, updateFilter } = await renderRecipeFilter({
      mount,
    });

    await updateFilter({ keywords: 'Burger' });

    expect(filterChangeCalls).toHaveLength(6);
    expect(filterChangeCalls[filterChangeCalls.length - 1]).toMatchObject({
      keywords: 'Burger',
    });
  });

  async function renderRecipeFilter({ mount }: ComponentFixtures) {
    const filterChangeCalls: RecipeFilter[] = [];
    const locator = await mount(RecipeFilterComponent, {
      on: {
        filterChange(filter) {
          filterChangeCalls.push(filter);
        },
      },
    });

    return {
      filterChangeCalls,
      async updateFilter({ keywords }: { keywords: string }) {
        await locator.getByLabel('Keywords').pressSequentially(keywords);
      },
    };
  }
});
