import { expect, test } from '@jscutlery/playwright-ct-angular';
import { OutputLegacyComponent } from '../src/output-legacy.component';

test('output legacy', async ({ mount }) => {
  let value: number | undefined;
  const component = await mount(OutputLegacyComponent, {
    on: {
      selectMagicValue(v) {
        value = v;
      },
    },
  });

  await component.getByRole('button').click();

  expect(value).toBe(42);
});
