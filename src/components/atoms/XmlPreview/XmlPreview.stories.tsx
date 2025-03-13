import type { Meta, StoryObj } from '@storybook/react';

import { XmlPreview } from './XmlPreview';

const meta: Meta<typeof XmlPreview> = {
  title: 'Atoms/XmlPreview',
  component: XmlPreview,
  tags: ['autodocs'],
  args: {
    children: 'Example',
    variant: 'default'
  }
};

export default meta;

type Story = StoryObj<typeof XmlPreview>;

export const Default: Story = {};
