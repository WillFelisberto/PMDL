import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DiscountForm } from './DiscountForm';
import { DiscountStructure } from '@/types/promotion';

const meta: Meta<typeof DiscountForm> = {
  title: 'Atoms/DiscountForm',
  component: DiscountForm,
  tags: ['autodocs'],
  argTypes: {
    discount: {
      control: 'object',
      description: 'Estrutura de desconto configurável'
    },
    onChange: { action: 'changed' }
  }
};

export default meta;

type Story = StoryObj<typeof DiscountForm>;

const Template = (args: any) => {
  const [discount, setDiscount] = useState<DiscountStructure>(
    args.discount || { calculatorType: '', discountType: 'percentOff', adjuster: 0 }
  );

  return <DiscountForm {...args} discount={discount} onChange={setDiscount} />;
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    discount: {
      calculatorType: '',
      discountType: 'percentOff',
      adjuster: 10
    }
  }
};

export const FixedPrice: Story = {
  render: (args) => <Template {...args} />,
  args: {
    discount: {
      calculatorType: '',
      discountType: 'fixedPrice',
      adjuster: 50
    }
  }
};

export const AmountOff: Story = {
  render: (args) => <Template {...args} />,
  args: {
    discount: {
      calculatorType: '',
      discountType: 'amountOff',
      adjuster: 20
    }
  }
};
