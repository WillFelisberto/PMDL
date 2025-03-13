import { ComparatorCondition, PromotionCondition } from '@/types/promotion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';

export const SortableCondition = ({
  condition,
  onUpdate,
  onDelete
}: {
  condition: PromotionCondition;
  onUpdate: (updated: PromotionCondition) => void;
  onDelete: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: condition.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  if (condition.type !== 'comparator') {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="group relative bg-gray-100 p-4 rounded-lg border border-gray-300 text-gray-600"
        data-testid="non-editable-condition"
      >
        <p className="text-sm">
          {`Este tipo de condição (${condition.type}) ainda não é editável aqui.`}
        </p>
        <button
          onClick={onDelete}
          data-testid="delete-button"
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  const comparatorCondition = condition as ComparatorCondition;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative bg-gray-50 p-4 rounded-lg border"
      data-testid="sortable-condition"
    >
      <div className="flex gap-2 items-center">
        <button {...listeners} {...attributes} className="cursor-grab" data-testid="drag-handle">
          <GripVertical className="text-gray-400" />
        </button>

        <select
          className="flex-1 p-2 border rounded-md"
          value={comparatorCondition.comparatorType}
          onChange={(e) =>
            onUpdate({
              ...comparatorCondition,
              comparatorType: e.target.value as ComparatorCondition['comparatorType']
            })
          }
          data-testid="comparator-select"
        >
          <option value="equals">=</option>
          <option value="not-equals">≠</option>
          <option value="greater-than">&gt;</option>
          <option value="greater-than-or-equals">≥</option>
          <option value="less-than">&lt;</option>
          <option value="less-than-or-equals">≤</option>
          <option value="contains">Contém</option>
          <option value="starts-with">Começa com</option>
          <option value="ends-with">Termina com</option>
          <option value="isoneof">É um de</option>
          <option value="isnotoneof">Não é um de</option>
          <option value="includes">Inclui</option>
          <option value="includes-any">Inclui qualquer</option>
          <option value="includes-all">Inclui todos</option>
        </select>

        <input
          className="flex-1 p-2 border rounded-md"
          placeholder="Campo (ex: order.total)"
          value={comparatorCondition.leftValue}
          onChange={(e) => onUpdate({ ...comparatorCondition, leftValue: e.target.value })}
          data-testid="left-value-input"
        />

        <input
          className="flex-1 p-2 border rounded-md"
          placeholder="Valor"
          value={comparatorCondition.rightValue}
          onChange={(e) =>
            onUpdate({
              ...comparatorCondition,
              rightValue: e.target.value
            })
          }
          data-testid="right-value-input"
        />

        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
          data-testid="delete-button"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
