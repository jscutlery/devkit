import { moduleMetadata, Story } from '@storybook/angular';
import { HelloComponent, HelloModule } from './hello.component';

const Template: Story<HelloComponent> = () => ({
  component: HelloComponent,
  decorators: [moduleMetadata({ imports: [HelloModule] })],
});

export const Basic = Template.bind({});

export const WithName = Template.bind({});
WithName.args = {
  name: 'JSCutlery',
};
