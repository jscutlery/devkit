import { expect, test } from '@jscutlery/playwright-ct-angular';
import { ChildComponent } from '../src/child.component';

test('template', async ({ mount }) => {
  const component = await mount('<h1>{{ 1 + 1 }}</h1>');
  await expect(component).toHaveText('2');
});

test('template with child component', async ({ mount }) => {
  const component = await mount('<jc-child message="Hello!"/>', {
    imports: [ChildComponent],
  });

  await expect(component).toContainText('Hello!');
});

test('template with inputs', async ({ mount }) => {
  const component = await mount('<h1>{{ message }}</h1>', {
    props: {
      message: 'Hello!',
    },
  });

  await expect(component).toContainText('Hello!');
});

test('render a template with outputs', async ({ mount }) => {
  let value: number | undefined;
  const component = await mount(
    '<button (click)="onSubmit(42)">CLICK</button>',
    {
      props: {
        onSubmit(v: number) {
          value = v;
        },
      },
    },
  );

  await component.click();

  expect(value).toBe(42);
});
