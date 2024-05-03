import { expect, test } from '@jscutlery/playwright-ct-angular';
import { InputComponent } from '../src/input.component';

test('input', async ({ mount }) => {
  const component = await mount(InputComponent, {
    props: {
      title: 'Hello world!',
    },
  });

  await expect(component).toContainText('Hello world!');
});

test.skip('update input', async ({ mount }) => {
  const component = await mount(InputComponent, {
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
