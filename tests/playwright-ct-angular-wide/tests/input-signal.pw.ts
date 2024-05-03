import { expect, test } from '@jscutlery/playwright-ct-angular';
import { InputSignalComponent } from '../src/input-signal.component';

test.skip('signal input', async ({ mount }) => {
  const component = await mount(InputSignalComponent, {
    props: {
      // @ts-ignore todo: remove this line once the issue is fixed
      title: 'Hello world!',
    },
  });

  await expect(component).toContainText('Hello world!');
});
