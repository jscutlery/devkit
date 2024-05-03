import { expect, test } from '@jscutlery/playwright-ct-angular';
import { InputSignalComponent } from '../src/input-signal.component';

test('signal input', async ({ mount }) => {
  const component = await mount(InputSignalComponent, {
    props: {
      title: 'Hello world!',
    },
  });

  await expect(component).toContainText('Hello world!');
});
