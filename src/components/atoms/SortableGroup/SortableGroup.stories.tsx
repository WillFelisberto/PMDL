import type { Meta, StoryObj } from '@storybook/react';

import { SortableGroup } from './SortableGroup';

const meta: Meta<typeof SortableGroup> = {
  title: 'Atoms/SortableGroup',
  component: SortableGroup,
  tags: ['autodocs'],
  args: {
    children: 'Example',
    variant: 'default'
  }
};

export default meta;

type Story = StoryObj<typeof SortableGroup>;

export const Default: Story = {};
