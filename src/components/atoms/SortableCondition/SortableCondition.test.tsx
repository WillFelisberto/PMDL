import { SortableCondition } from './SortableCondition';

import { fireEvent, render, screen } from '@/tests/test-utils';
import { ComparatorCondition, PromotionCondition } from '@/types/promotion';

describe('SortableCondition', () => {
  let mockCondition: ComparatorCondition;
  let mockOnUpdate: jest.Mock;
  let mockOnDelete: jest.Mock;

  beforeEach(() => {
    mockCondition = {
      id: 'condition-1',
      type: 'comparator',
      comparatorType: 'equals',
      leftValue: 'order.total',
      rightValue: '100',
      dataType: 'number'
    };

    mockOnUpdate = jest.fn();
    mockOnDelete = jest.fn();
  });

  it('deve renderizar corretamente a condição comparadora', () => {
    const { container } = render(
      <SortableCondition
        condition={mockCondition}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('sortable-condition')).toBeInTheDocument();
    expect(screen.getByTestId('drag-handle')).toBeInTheDocument();
    expect(screen.getByTestId('comparator-select')).toHaveValue('equals');
    expect(screen.getByTestId('left-value-input')).toHaveValue('order.total');
    expect(screen.getByTestId('right-value-input')).toHaveValue('100');
    expect(screen.getByTestId('delete-button')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('deve atualizar o tipo de comparador ao alterar o select', () => {
    render(
      <SortableCondition
        condition={mockCondition}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const selectElement = screen.getByTestId('comparator-select');
    fireEvent.change(selectElement, { target: { value: 'greater-than' } });

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockCondition,
      comparatorType: 'greater-than'
    });
  });

  it('deve atualizar o leftValue ao alterar o input correspondente', () => {
    render(
      <SortableCondition
        condition={mockCondition}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const leftValueInput = screen.getByTestId('left-value-input');
    fireEvent.change(leftValueInput, { target: { value: 'order.discount' } });

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockCondition,
      leftValue: 'order.discount'
    });
  });

  it('deve atualizar o rightValue ao alterar o input correspondente', () => {
    render(
      <SortableCondition
        condition={mockCondition}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const rightValueInput = screen.getByTestId('right-value-input');
    fireEvent.change(rightValueInput, { target: { value: '50' } });

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockCondition,
      rightValue: '50'
    });
  });

  it('deve chamar a função onDelete ao clicar no botão de excluir', () => {
    render(
      <SortableCondition
        condition={mockCondition}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalled();
  });

  it('deve renderizar corretamente uma condição não editável', () => {
    const nonEditableCondition: PromotionCondition = {
      id: 'non-editable',
      type: 'unsupported-type'
    } as unknown as PromotionCondition;

    render(
      <SortableCondition
        condition={nonEditableCondition}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('non-editable-condition')).toBeInTheDocument();
    expect(
      screen.getByText(/Este tipo de condição \(unsupported-type\) ainda não é editável aqui./i)
    ).toBeInTheDocument();
  });
});
