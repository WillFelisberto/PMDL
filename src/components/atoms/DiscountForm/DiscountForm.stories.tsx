import type { Meta, StoryObj } from '@storybook/react';

import { DiscountForm } from './DiscountForm';

const meta: Meta<typeof DiscountForm> = {
  title: 'Atoms/DiscountForm',
  component: DiscountForm,
  tags: ['autodocs'],
  args: {
    children: 'Example',
    variant: 'default'
  }
};

export default meta;

type Story = StoryObj<typeof DiscountForm>;

export const Default: Story = {};
