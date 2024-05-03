import { expect, test } from '@jscutlery/playwright-ct-angular';
import { BasicComponent } from '../src/basic.component';
import { BasicWithTemplateComponent } from '../src/basic-with-template.component';

test('mount', async ({ mount }) => {
  const component = await mount(BasicComponent);
  await expect(component).toContainText('Hello world!');
});

test('mount with template in separate file', async ({ mount }) => {
  const component = await mount(BasicWithTemplateComponent);
  await expect(component).toContainText('Hello world!');
});

test.skip('unmount', async ({ mount }) => {
  const component = await mount(BasicComponent);
  await component.unmount();
  await expect(component).not.toContainText('Hello world!');
});
