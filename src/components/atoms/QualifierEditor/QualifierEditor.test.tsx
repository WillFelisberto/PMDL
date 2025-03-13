import { QualifierEditor } from './QualifierEditor';

import { render, screen, fireEvent } from '@/tests/test-utils';
import { OperatorCondition, ComparatorCondition } from '@/types/promotion';

// Mock para crypto.randomUUID
beforeAll(() => {
  Object.defineProperty(global, 'crypto', {
    value: {
      randomUUID: () => 'mock-uuid-1234'
    }
  });
});

describe('QualifierEditor', () => {
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve exibir botões de adição quando não houver qualificador', () => {
    const { container } = render(<QualifierEditor qualifier={undefined} onUpdate={mockOnUpdate} />);

    expect(screen.getByTestId('add-and-group')).toBeInTheDocument();
    expect(screen.getByTestId('add-or-group')).toBeInTheDocument();
    expect(screen.getByTestId('add-simple-condition')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('deve adicionar um grupo AND ao clicar no botão', () => {
    render(<QualifierEditor qualifier={undefined} onUpdate={mockOnUpdate} />);

    fireEvent.click(screen.getByTestId('add-and-group'));

    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'operator',
        operatorType: 'and'
      })
    );
  });

  it('deve exibir e remover uma condição simples', async () => {
    const condition: ComparatorCondition = {
      id: '1',
      type: 'comparator',
      comparatorType: 'equals',
      leftValue: 'order.total',
      rightValue: '100',
      dataType: 'java.lang.Double'
    };

    render(<QualifierEditor qualifier={condition} onUpdate={mockOnUpdate} />);

    // Hover para mostrar o botão de delete
    const conditionElement = screen.getByTestId('sortable-condition');
    fireEvent.mouseEnter(conditionElement);

    const deleteButton = await screen.findByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(mockOnUpdate).toHaveBeenCalledWith(undefined);
  });

  it('deve exibir e interagir com um grupo AND', async () => {
    const group: OperatorCondition = {
      id: '2',
      type: 'operator',
      operatorType: 'and',
      conditions: []
    };

    render(<QualifierEditor qualifier={group} onUpdate={mockOnUpdate} />);

    // Verificar elementos do grupo
    expect(screen.getByTestId('sortable-group')).toBeInTheDocument();
    expect(screen.getByTestId('add-condition-button')).toBeInTheDocument();
    expect(screen.getByTestId('add-group-button')).toBeInTheDocument();

    // Testar hover para mostrar botão de delete
    const groupElement = screen.getByTestId('sortable-group');
    fireEvent.mouseEnter(groupElement);

    const deleteButton = await screen.findByTestId('delete-button');
    fireEvent.click(deleteButton);
    expect(mockOnUpdate).toHaveBeenCalledWith(undefined);
  });

  it('deve adicionar uma nova condição dentro do grupo', async () => {
    const group: OperatorCondition = {
      id: '3',
      type: 'operator',
      operatorType: 'and',
      conditions: []
    };

    render(<QualifierEditor qualifier={group} onUpdate={mockOnUpdate} />);

    fireEvent.click(screen.getByTestId('add-condition-button'));

    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        conditions: [
          expect.objectContaining({
            type: 'comparator'
          })
        ]
      })
    );
  });

  it('deve atualizar valores de uma condição', async () => {
    let currentCondition: ComparatorCondition = {
      id: '4',
      type: 'comparator',
      comparatorType: 'equals',
      leftValue: '',
      rightValue: '',
      dataType: 'java.lang.String'
    };

    const { rerender } = render(
      <QualifierEditor
        qualifier={currentCondition}
        onUpdate={(updated) => {
          currentCondition = updated as ComparatorCondition;
          mockOnUpdate(updated);
        }}
      />
    );

    // Atualizar e verificar leftValue
    fireEvent.change(screen.getByTestId('left-value-input'), {
      target: { value: 'order.paymentMethod' }
    });
    expect(mockOnUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        leftValue: 'order.paymentMethod',
        rightValue: ''
      })
    );

    // Atualizar e verificar rightValue
    rerender(<QualifierEditor qualifier={currentCondition} onUpdate={mockOnUpdate} />);
    fireEvent.change(screen.getByTestId('right-value-input'), { target: { value: 'pix' } });

    expect(mockOnUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        leftValue: 'order.paymentMethod',
        rightValue: 'pix'
      })
    );
  });
});
