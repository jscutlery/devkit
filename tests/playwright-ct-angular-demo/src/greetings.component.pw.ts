import { expect, test } from '@jscutlery/playwright-ct-angular';
import { GreetingsComponent } from './greetings.component';

test('<wm-greetings> should be polite', async ({ mount }) => {
  /* Mount without options. */
  const locator = await mount(GreetingsComponent);

  await expect(locator).toHaveText('👋 Hello!');
});