import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SortableCondition } from './SortableCondition';
import { ComparatorCondition, PromotionCondition } from '@/types/promotion';

const meta: Meta<typeof SortableCondition> = {
  title: 'Atoms/SortableCondition',
  component: SortableCondition,
  tags: ['autodocs'],
  argTypes: {
    condition: {
      control: 'object',
      description: 'Objeto da condição usada para comparações'
    },
    onUpdate: { action: 'updated' },
    onDelete: { action: 'deleted' }
  }
};

export default meta;

type Story = StoryObj<typeof SortableCondition>;

const Template = (args: any) => {
  const [condition, setCondition] = useState<PromotionCondition>(args.condition);

  return <SortableCondition {...args} condition={condition} onUpdate={setCondition} />;
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    condition: {
      id: 'cond-1',
      type: 'comparator',
      comparatorType: 'equals',
      leftValue: 'order.total',
      rightValue: '100',
      dataType: 'java.lang.String'
    } as ComparatorCondition
  }
};

export const GreaterThan: Story = {
  render: (args) => <Template {...args} />,
  args: {
    condition: {
      id: 'cond-2',
      type: 'comparator',
      comparatorType: 'greater-than',
      leftValue: 'cart.items',
      rightValue: '5',
      dataType: 'java.lang.Integer'
    } as ComparatorCondition
  }
};
