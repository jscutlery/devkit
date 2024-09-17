import { expect, test } from '@jscutlery/playwright-ct-angular';
import { InputComponent } from '../src/input.component';
import { InputRequiredComponent } from '../src/input-required.component';

test('input', async ({ mount }) => {
  const component = await mount(InputComponent, {
    props: {
      title: 'Hello world!',
    },
  });

  await expect(component).toContainText('Hello world!');
});


test('required input', async ({ mount }) => {
  const component = await mount(InputRequiredComponent, {
    props: {
      title: 'Hello world!',
    },
  });

  await expect(component).toContainText('Hello world!');
});
