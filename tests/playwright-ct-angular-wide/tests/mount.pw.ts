import { expect, test } from '@jscutlery/playwright-ct-angular';
import { BasicComponent } from '../src/basic';

test('mount', async ({ mount }) => {
  const component = await mount(BasicComponent);
  await expect(component).toContainText('Hello world!');
});
