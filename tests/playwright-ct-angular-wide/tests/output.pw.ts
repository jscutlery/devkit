import { expect, test } from '@jscutlery/playwright-ct-angular';
import { OutputUnsubscriptionComponent } from '../src/output-unsubscription.component';
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

test('unsubscribe from output when the component is unmounted', async ({
  mount,
  page,
}) => {
  const component = await mount(OutputUnsubscriptionComponent, {
    on: {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      selectMagicValue() {},
    },
  });

  await component.unmount();

  /* Check that the output observable had been unsubscribed from
   * as it sets a global variable `hasUnusbscribed` to true
   * when it detects unsubscription. Cf. OutputComponent. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(await page.evaluate(() => (window as any).hasUnsubscribed)).toBe(true);
});
