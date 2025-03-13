import { DiscountForm } from '.';

import { fireEvent, render, screen } from '@/tests/test-utils';
import { DiscountStructure } from '@/types/promotion';

describe('DiscountForm', () => {
  const mockOnChange = jest.fn();

  const defaultDiscount: DiscountStructure = {
    calculatorType: 'default',
    discountType: 'percentOff',
    adjuster: 10
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render correctly the form', () => {
    const { container } = render(
      <DiscountForm discount={defaultDiscount} onChange={mockOnChange} />
    );

    expect(screen.getByText('💰 Configurar Desconto')).toBeInTheDocument();

    expect(screen.getByLabelText('Tipo de Desconto')).toBeInTheDocument();

    expect(screen.getByLabelText('Porcentagem')).toBeInTheDocument();

    expect(
      screen.getByText('O desconto será aplicado como porcentagem sobre o total.')
    ).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('Deve chamar onChange ao alterar o tipo de desconto', () => {
    render(<DiscountForm discount={defaultDiscount} onChange={mockOnChange} />);

    const select = screen.getByLabelText('Tipo de Desconto');

    fireEvent.change(select, { target: { value: 'amountOff' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultDiscount,
      discountType: 'amountOff'
    });

    fireEvent.change(select, { target: { value: 'fixedPrice' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultDiscount,
      discountType: 'fixedPrice'
    });
  });

  it('Deve chamar onChange ao alterar o valor do desconto', () => {
    render(<DiscountForm discount={defaultDiscount} onChange={mockOnChange} />);

    const input = screen.getByLabelText('Porcentagem');

    fireEvent.change(input, { target: { value: '25' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultDiscount,
      adjuster: 25
    });

    fireEvent.change(input, { target: { value: '30.5' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultDiscount,
      adjuster: 30.5
    });
  });

  it('Deve exibir corretamente os rótulos e dicas baseados no tipo de desconto', () => {
    const { rerender } = render(
      <DiscountForm discount={defaultDiscount} onChange={mockOnChange} />
    );

    expect(
      screen.getByText('O desconto será aplicado como porcentagem sobre o total.')
    ).toBeInTheDocument();

    rerender(
      <DiscountForm
        discount={{ ...defaultDiscount, discountType: 'amountOff' }}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText('O valor fixo será subtraído do total do pedido.')).toBeInTheDocument();

    rerender(
      <DiscountForm
        discount={{ ...defaultDiscount, discountType: 'fixedPrice' }}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText('O preço final será definido para este valor.')).toBeInTheDocument();
  });
});
