import { expect, test } from '@jscutlery/playwright-ct-angular';
import { ChildComponent } from '../src/child.component';

test.skip('template', async ({ mount }) => {
  // @ts-expect-error todo fix this
  const component = await mount('<h1>{{ 1 + 1 }}</h1>');
  await expect(component).toHaveText('2');
});

test.skip('template with child component', async ({ mount }) => {
  // @ts-expect-error todo fix this
  const component = await mount('<jc-child message="Hello!"/>', {
    imports: [ChildComponent],
  });

  await expect(component).toContainText('Hello!');
});

test.skip('template with inputs', async ({ mount }) => {
  // @ts-expect-error todo fix this
  const component = await mount('<h1>{{ message }}</h1>', {
    props: {
      message: 'Hello!',
    },
  });

  await expect(component).toContainText('Hello!');
});

test.skip('render a template with outputs', async ({ mount }) => {
  let value: number;
  const component = await mount(
    // @ts-expect-error todo fix this
    '<button (submit)="onSubmit(42)">CLICK</button>',
    {
      props: {
        onSubmit(v: 42) {
          value = v;
        },
      },
    },
  );

  await component.click();

  await expect(async () => {
    expect(value).toBe('hello');
  }).toPass();
});
