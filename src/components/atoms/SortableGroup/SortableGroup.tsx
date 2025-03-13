'use client';
import { OperatorCondition, PromotionCondition } from '@/types/promotion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Plus } from 'lucide-react';
import { useState } from 'react';

import { SortableCondition } from '../SortableCondition';

export const SortableGroup = ({
  group,
  onUpdate,
  onDelete,
  depth = 0
}: {
  group: OperatorCondition;
  onUpdate: (updated: OperatorCondition) => void;
  onDelete: () => void;
  depth?: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: group.id
  });
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: `${depth * 24}px` // Indentação para grupos aninhados
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      onUpdate({
        ...group,
        conditions: arrayMove(
          group.conditions,
          group.conditions.findIndex((c) => c.id === active.id),
          group.conditions.findIndex((c) => c.id === over.id)
        )
      });
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative bg-blue-50 rounded-lg border-2 border-blue-200 p-4 group"
      onMouseEnter={() => setIsHovered(true)}
      data-testid="sortable-group"
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header do Grupo */}
      <div className="flex items-center gap-2 mb-2">
        <button
          {...listeners}
          {...attributes}
          className="cursor-grab text-blue-500 hover:text-blue-700"
        >
          <GripVertical size={16} />
        </button>

        <select
          className="px-2 py-1 rounded-md bg-white border"
          value={group.operatorType}
          onChange={(e) =>
            onUpdate({
              ...group,
              operatorType: e.target.value as 'and' | 'or' | 'not' | 'custom'
            })
          }
        >
          <option value="and">AND</option>
          <option value="or">OR</option>
          <option value="not">NOT</option>
        </select>

        {isHovered && (
          <button
            onClick={onDelete}
            data-testid="delete-button"
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Condições Filhas */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={group.conditions} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {group.conditions.map((item) =>
              'operatorType' in item ? (
                <SortableGroup
                  key={item.id}
                  group={item}
                  onUpdate={(updated) => {
                    const newConditions = group.conditions.map((c) =>
                      c.id === updated.id ? updated : c
                    );
                    onUpdate({ ...group, conditions: newConditions });
                  }}
                  onDelete={() => {
                    const newConditions = group.conditions.filter((c) => c.id !== item.id);
                    onUpdate({ ...group, conditions: newConditions });
                  }}
                  depth={depth + 1}
                />
              ) : (
                <SortableCondition
                  key={item.id}
                  condition={item}
                  onUpdate={(updated) => {
                    const newConditions = group.conditions.map((c) =>
                      c.id === updated.id ? updated : c
                    );
                    onUpdate({ ...group, conditions: newConditions });
                  }}
                  onDelete={() => {
                    const newConditions = group.conditions.filter((c) => c.id !== item.id);
                    onUpdate({ ...group, conditions: newConditions });
                  }}
                />
              )
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* Botões de Ação */}
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => {
            const newCondition: PromotionCondition = {
              id: crypto.randomUUID(),
              type: 'comparator',
              comparatorType: 'equals',
              leftValue: '',
              rightValue: '',
              dataType: 'java.lang.String'
            };
            onUpdate({
              ...group,
              conditions: [...group.conditions, newCondition]
            });
          }}
          data-testid="add-condition-button"
          className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
        >
          <Plus size={14} /> Condição
        </button>

        <button
          onClick={() => {
            const newGroup: OperatorCondition = {
              id: crypto.randomUUID(),
              type: 'operator',
              operatorType: 'and',
              conditions: []
            };
            onUpdate({ ...group, conditions: [...group.conditions, newGroup] });
          }}
          data-testid="add-group-button"
          className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
        >
          <Plus size={14} /> Grupo
        </button>
      </div>
    </div>
  );
};
