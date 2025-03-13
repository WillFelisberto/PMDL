import type { Meta, StoryObj } from '@storybook/react';

import { SortableCondition } from './SortableCondition';

const meta: Meta<typeof SortableCondition> = {
  title: 'Atoms/SortableCondition',
  component: SortableCondition,
  tags: ['autodocs'],
  args: {
    children: 'Example',
    variant: 'default'
  }
};

export default meta;

type Story = StoryObj<typeof SortableCondition>;

export const Default: Story = {};
