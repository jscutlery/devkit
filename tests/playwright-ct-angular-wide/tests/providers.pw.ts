import { expect, test } from '@jscutlery/playwright-ct-angular';
import { InjectComponent, TOKEN } from '../src/inject.component';

test.skip('providers', async ({ mount }) => {
  const component = await mount(InjectComponent, {
    // @ts-expect-error todo fix this
    providers: [
      {
        provide: TOKEN,
        useValue: 42,
      },
    ],
  });
  await expect(component).toContainText('42');
});
