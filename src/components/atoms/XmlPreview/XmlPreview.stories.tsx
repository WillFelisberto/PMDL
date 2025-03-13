import type { Meta, StoryObj } from '@storybook/react';
import { XmlPreview } from './XmlPreview';

const meta: Meta<typeof XmlPreview> = {
  title: 'Atoms/XmlPreview',
  component: XmlPreview,
  tags: ['autodocs'],
  argTypes: {
    xml: {
      control: 'text',
      description: 'Código XML a ser exibido no preview'
    }
  }
};

export default meta;

type Story = StoryObj<typeof XmlPreview>;

export const Default: Story = {
  args: {
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<promotion>
  <name>Promoção Teste</name>
  <discount>10%</discount>
</promotion>`
  }
};
