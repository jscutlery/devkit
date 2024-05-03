import { expect, test } from '@jscutlery/playwright-ct-angular';
import { HooksConfig } from '../playwright';
import { HooksComponent } from '../src/hooks.component';

test.skip('inject a token', async ({ mount }) => {
  const component = await mount<HooksComponent, HooksConfig>(HooksComponent, {
    hooksConfig: { injectToken: true },
    props: {
      value: 42,
    },
  });
  await expect(component).toHaveText('42');
});
