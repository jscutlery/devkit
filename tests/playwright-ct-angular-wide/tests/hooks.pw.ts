import { expect, test } from '@jscutlery/playwright-ct-angular';
import { HooksConfig } from '../playwright';
import { InjectComponent } from '../src/inject.component';

test('inject a token', async ({ mount }) => {
  const component = await mount<InjectComponent, HooksConfig>(InjectComponent, {
    hooksConfig: { injectToken: true },
    props: {
      value: 42,
    },
  });
  await expect(component).toHaveText('42');
});
