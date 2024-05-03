import { expect, test } from '@jscutlery/playwright-ct-angular';
import { InputLegacyComponent } from '../src/input-legacy.component';

test('input legacy', async ({ mount }) => {
  const component = await mount(InputLegacyComponent, {
    props: {
      title: 'Hello world!',
    },
  });

  await expect(component).toContainText('Hello world!');
});

test.skip('update input', async ({ mount }) => {
  const component = await mount(InputLegacyComponent, {
    props: {
      title: 'Hello world!',
    },
  });

  await component.update({
    props: {
      title: 'Hello france!',
    },
  });

  await expect(component).toContainText('Hello france!');
});
