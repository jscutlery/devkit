import { expect, test } from '@jscutlery/playwright-ct-angular';
import { OutputComponent } from '../src/output.component';

test('output', async ({ mount }) => {
  let value: number | undefined;
  const component = await mount(OutputComponent, {
    on: {
      action(v) {
        value = v;
      },
    },
  });

  await component.click();

  expect(value).toBe(42);
});
