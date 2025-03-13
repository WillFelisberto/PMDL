import { PromotionCondition, OperatorCondition, ComparatorCondition } from '@/types/promotion';

import { SortableCondition } from '@/components/atoms/SortableCondition';
import { SortableGroup } from '@/components/atoms/SortableGroup';

type QualifierEditorProps = {
  qualifier: PromotionCondition | undefined;
  onUpdate: (qualifier: PromotionCondition | undefined) => void;
};

export const QualifierEditor = ({ qualifier, onUpdate }: QualifierEditorProps) => {
  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-700">Qualificador</h3>

      {qualifier ? (
        <>
          {qualifier.type === 'operator' ? (
            <SortableGroup
              key={qualifier.id}
              group={qualifier}
              onUpdate={onUpdate}
              onDelete={() => onUpdate(undefined)}
            />
          ) : (
            <SortableCondition
              key={qualifier.id}
              condition={qualifier as ComparatorCondition}
              onUpdate={onUpdate}
              onDelete={() => onUpdate(undefined)}
            />
          )}
        </>
      ) : (
        <p className="text-gray-500 text-sm">Nenhuma condição adicionada.</p>
      )}

      {/* Botões para adicionar operadores (AND/OR) */}
      {!qualifier && (
        <div className="mt-4 flex gap-2">
          <button
            data-testid="add-and-group"
            onClick={() => {
              const newQualifierGroup: OperatorCondition = {
                id: crypto.randomUUID(),
                type: 'operator',
                operatorType: 'and',
                conditions: []
              };
              onUpdate(newQualifierGroup);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            + Adicionar Grupo (AND)
          </button>

          <button
            data-testid="add-or-group"
            onClick={() => {
              const newQualifierGroup: OperatorCondition = {
                id: crypto.randomUUID(),
                type: 'operator',
                operatorType: 'or',
                conditions: []
              };
              onUpdate(newQualifierGroup);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            + Adicionar Grupo (OR)
          </button>

          <button
            onClick={() => {
              const newQualifier: ComparatorCondition = {
                id: crypto.randomUUID(),
                type: 'comparator',
                comparatorType: 'equals',
                leftValue: '',
                rightValue: '',
                dataType: 'java.lang.String'
              };
              onUpdate(newQualifier);
            }}
            data-testid="add-simple-condition"
          >
            + Adicionar Condição Simples
          </button>
        </div>
      )}
    </div>
  );
};
