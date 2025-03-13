import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SortableGroup } from './SortableGroup';
import { OperatorCondition } from '@/types/promotion';

const meta: Meta<typeof SortableGroup> = {
  title: 'Atoms/SortableGroup',
  component: SortableGroup,
  tags: ['autodocs'],
  argTypes: {
    group: {
      control: 'object',
      description: 'Grupo de condições ordenáveis'
    },
    onUpdate: { action: 'updated' },
    onDelete: { action: 'deleted' }
  }
};

export default meta;

type Story = StoryObj<typeof SortableGroup>;

const Template = (args: any) => {
  const [group, setGroup] = useState<OperatorCondition>(args.group);

  return <SortableGroup {...args} group={group} onUpdate={setGroup} />;
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    group: {
      id: 'group-1',
      type: 'operator',
      operatorType: 'and',
      conditions: []
    }
  }
};

export const WithNestedGroup: Story = {
  render: (args) => <Template {...args} />,
  args: {
    group: {
      id: 'group-2',
      type: 'operator',
      operatorType: 'or',
      conditions: [
        {
          id: 'nested-group',
          type: 'operator',
          operatorType: 'and',
          conditions: []
        }
      ]
    }
  }
};
