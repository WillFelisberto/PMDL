import type { Meta, StoryObj } from '@storybook/react';

import { JsonPreview } from './JsonPreview';

const meta: Meta<typeof JsonPreview> = {
  title: 'Atoms/JsonPreview',
  component: JsonPreview,
  tags: ['autodocs'],
  args: {
    children: 'Example',
    variant: 'default'
  }
};

export default meta;

type Story = StoryObj<typeof JsonPreview>;

export const Default: Story = {};
