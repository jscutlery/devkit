import { expect, test } from '@jscutlery/playwright-ct-angular';
import { HooksConfig } from '../playwright';
import { InjectComponent } from '../src/inject.component';

test('hooks provide stuff', async ({ mount }) => {
  const component = await mount<InjectComponent, HooksConfig>(InjectComponent, {
    hooksConfig: { provideToken: true },
  });
  await expect(component).toHaveText('42');
});

test('hooks execute code before mounting', async ({ mount }) => {
  const component = await mount<InjectComponent, HooksConfig>(InjectComponent, {
    hooksConfig: {
      provideToken: true,
      overrideToken: true,
    },
  });
  await expect(component).toHaveText('overriden');
});
