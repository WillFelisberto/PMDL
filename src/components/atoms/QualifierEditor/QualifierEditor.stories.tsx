import type { Meta, StoryObj } from '@storybook/react';

import { QualifierEditor } from './QualifierEditor';

const meta: Meta<typeof QualifierEditor> = {
  title: 'Atoms/QualifierEditor',
  component: QualifierEditor,
  tags: ['autodocs'],
  args: {
    children: 'Example',
    variant: 'default'
  }
};

export default meta;

type Story = StoryObj<typeof QualifierEditor>;

export const Default: Story = {};
