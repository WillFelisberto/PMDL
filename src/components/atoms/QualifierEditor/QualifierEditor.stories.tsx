import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { QualifierEditor } from './QualifierEditor';
import { PromotionCondition, OperatorCondition, ComparatorCondition } from '@/types/promotion';

const meta: Meta<typeof QualifierEditor> = {
  title: 'Atoms/QualifierEditor',
  component: QualifierEditor,
  tags: ['autodocs'],
  argTypes: {
    qualifier: {
      control: 'object',
      description: 'Objeto do qualificador usado para definir condições da promoção'
    },
    onUpdate: { action: 'updated' }
  }
};

export default meta;

type Story = StoryObj<typeof QualifierEditor>;

const Template = (args: any) => {
  const [qualifier, setQualifier] = useState<PromotionCondition | undefined>(args.qualifier);

  return <QualifierEditor {...args} qualifier={qualifier} onUpdate={setQualifier} />;
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    qualifier: undefined
  }
};

export const WithAndGroup: Story = {
  render: (args) => <Template {...args} />,
  args: {
    qualifier: {
      id: 'group-1',
      type: 'operator',
      operatorType: 'and',
      conditions: []
    } as OperatorCondition
  }
};

export const WithComparator: Story = {
  render: (args) => <Template {...args} />,
  args: {
    qualifier: {
      id: 'cond-1',
      type: 'comparator',
      comparatorType: 'equals',
      leftValue: 'price',
      rightValue: '100',
      dataType: 'java.lang.String'
    } as ComparatorCondition
  }
};
