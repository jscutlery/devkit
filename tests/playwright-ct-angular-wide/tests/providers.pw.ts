import { expect, test } from '@jscutlery/playwright-ct-angular';
import { InjectComponent, TOKEN } from '../src/inject.component';

test('providers', async ({ mount }) => {
  const component = await mount(InjectComponent, {
    providers: [
      {
        provide: TOKEN,
        useValue: {
          value: 42,
        },
      },
    ],
  });
  await expect(component).toContainText('42');
});
