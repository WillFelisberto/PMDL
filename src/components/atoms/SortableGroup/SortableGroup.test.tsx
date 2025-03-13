import { SortableGroup } from './SortableGroup';

import { render, screen, fireEvent } from '@/tests/test-utils';
import { OperatorCondition } from '@/types/promotion';

describe('SortableGroup', () => {
  let mockGroup: OperatorCondition;
  let mockOnUpdate: jest.Mock;
  let mockOnDelete: jest.Mock;

  beforeAll(() => {
    Object.defineProperty(global, 'crypto', {
      value: {
        randomUUID: jest.fn(() => 'mocked-uuid')
      }
    });
  });

  beforeEach(() => {
    mockGroup = {
      id: 'group-1',
      type: 'operator',
      operatorType: 'and',
      conditions: []
    };

    mockOnUpdate = jest.fn();
    mockOnDelete = jest.fn();
  });

  it('deve renderizar corretamente', () => {
    const { container } = render(
      <SortableGroup group={mockGroup} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />
    );

    expect(screen.getByRole('button', { name: /condição/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /grupo/i })).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('deve permitir alterar o operador lógico', () => {
    render(<SortableGroup group={mockGroup} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'or' } });

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockGroup,
      operatorType: 'or'
    });
  });

  it('deve chamar onDelete corretamente ao remover o grupo', () => {
    render(<SortableGroup group={mockGroup} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    // Simula hover para o botão de delete aparecer
    const groupElement = screen.getByTestId('sortable-group');
    fireEvent.mouseEnter(groupElement);

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalled();
  });

  it('deve adicionar uma nova condição ao grupo', () => {
    render(<SortableGroup group={mockGroup} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const addConditionButton = screen.getByTestId('add-condition-button');
    fireEvent.click(addConditionButton);

    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        conditions: expect.arrayContaining([expect.objectContaining({ type: 'comparator' })])
      })
    );
  });

  it('deve adicionar um novo grupo dentro do grupo', () => {
    render(<SortableGroup group={mockGroup} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const addGroupButton = screen.getByTestId('add-group-button');
    fireEvent.click(addGroupButton);

    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        conditions: expect.arrayContaining([expect.objectContaining({ type: 'operator' })])
      })
    );
  });
});
