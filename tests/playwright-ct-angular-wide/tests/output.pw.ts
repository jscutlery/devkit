import { expect, test } from '@jscutlery/playwright-ct-angular';
import { OutputComponent } from '../src/output.component';

test('output', async ({ mount }) => {
  let value: number | undefined;
  const component = await mount(OutputComponent, {
    on: {
      selectMagicValue(v) {
        value = v;
      },
    },
  });

  await component.click();

  expect(value).toBe(42);
});

test.skip('replace existing listener when new listener is set', async ({
  mount,
}) => {
  let firstListenerCalled = false;
  let secondListenerCalled = false;

  const component = await mount(OutputComponent, {
    on: {
      selectMagicValue() {
        firstListenerCalled = true;
      },
    },
  });

  await component.update({
    on: {
      selectMagicValue() {
        secondListenerCalled = true;
      },
    },
  });

  await component.click();
  expect(firstListenerCalled).toBe(false);
  expect(secondListenerCalled).toBe(true);
});
