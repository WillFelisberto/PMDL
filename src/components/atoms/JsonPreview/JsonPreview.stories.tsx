import type { Meta, StoryObj } from '@storybook/react';
import { JsonPreview } from './JsonPreview';
import { Promotion } from '@/types/promotion';

const meta: Meta<typeof JsonPreview> = {
  title: 'Atoms/JsonPreview',
  component: JsonPreview,
  tags: ['autodocs'],
  argTypes: {
    promotion: {
      control: 'object',
      description: 'Objeto de promoção usado para gerar o JSON'
    }
  }
};

export default meta;

type Story = StoryObj<typeof JsonPreview>;

const samplePromotion: Promotion = {
  displayName: 'Promoção de Teste',
  description: 'Descrição da promoção de teste',
  priority: 1,
  offer: {
    discountStructures: [
      {
        target: 'order',
        calculatorType: 'default',
        discountType: 'percentOff',
        adjuster: 10
      }
    ]
  },
  enabled: false,
  qualifier: undefined,
  conditions: [],
  sites: [
    {
      repositoryId: 'site-1'
    }
  ]
};

export const Default: Story = {
  args: {
    promotion: samplePromotion
  }
};
