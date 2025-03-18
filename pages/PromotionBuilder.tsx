'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Promotion } from '@/types/promotion';
import { SortableGroup } from '@/components/atoms/SortableGroup';
import { SortableCondition } from '@/components/atoms/SortableCondition';
import { XmlPreview } from '@/components/atoms/XmlPreview';
import { JsonPreview } from '@/components/atoms/JsonPreview';
import { generatePmdl } from 'utils/generatePmdl';
import { QualifierEditor } from '@/components/atoms/QualifierEditor';
import { DiscountForm } from '@/components/atoms/DiscountForm';

export default function PromotionBuilder() {
  const [promotion, setPromotion] = useState<Promotion>({
    displayName: '',
    description: '',
    priority: 1,
    conditions: [],
    enabled: true,
    qualifier: undefined,
    offer: {
      discountStructures: [
        {
          adjuster: 0,
          calculatorType: 'standard',
          discountType: 'percentOff',
          target: 'order'
        }
      ]
    },
    sites: []
  });

  const [xml, setXml] = useState<string>('');

  useEffect(() => {
    if (promotion.displayName && promotion.qualifier) {
      const newXml = generatePmdl(promotion);
      setXml(newXml);
    } else {
      setXml('');
    }
  }, [promotion]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const updatePromotion = (newPromotion: Partial<Promotion>) => {
    setPromotion((prev) => ({ ...prev, ...newPromotion }));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setPromotion((prev) => {
        const oldIndex = prev.conditions.findIndex((c) => c.id === active.id);
        const newIndex = prev.conditions.findIndex((c) => c.id === over.id);

        return {
          ...prev,
          conditions: arrayMove([...prev.conditions], oldIndex, newIndex)
        };
      });
    }
  };

  return (
    <div className="container mx-auto min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Gerador de Promoções PMDL</h1>

        {/* Nome da Promoção */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Promoção</label>
          <input
            className="w-full p-2 border rounded-md"
            value={promotion.displayName}
            onChange={(e) => updatePromotion({ displayName: e.target.value })}
          />
        </div>

        {/* Nome da Promoção */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
          <input
            className="w-full p-2 border rounded-md"
            value={promotion.description}
            onChange={(e) => updatePromotion({ description: e.target.value })}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aplicar desconto em:
          </label>
          <select
            className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500"
            value={promotion.offer.discountStructures[0]?.target || 'order'}
            onChange={(e) =>
              updatePromotion({
                ...promotion,
                offer: {
                  discountStructures: [
                    {
                      ...promotion.offer.discountStructures[0],
                      target: e.target.value as 'order' | 'shipping' | 'item'
                    }
                  ]
                }
              })
            }
          >
            <option value="order">Pedido inteiro</option>
            <option value="shipping">Frete</option>
            <option value="item">Item específico</option>
          </select>
        </div>

        {/* Qualifier Editor */}
        <QualifierEditor
          qualifier={promotion.qualifier}
          onUpdate={(updatedQualifier) => updatePromotion({ qualifier: updatedQualifier })}
        />

        <DiscountForm
          discount={promotion.offer.discountStructures[0]} // Pegando o primeiro desconto
          onChange={(newDiscount) =>
            setPromotion({
              ...promotion,
              offer: {
                discountStructures: [newDiscount] // Atualizando o desconto corretamente
              }
            })
          }
        />

        {/* Área de Condições */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={promotion.conditions} strategy={verticalListSortingStrategy}>
            <div className="mb-6 space-y-3">
              {promotion.conditions.map((item) =>
                'operatorType' in item ? (
                  <SortableGroup
                    key={item.id}
                    group={item}
                    onUpdate={(updatedGroup) => {
                      updatePromotion({
                        conditions: promotion.conditions.map((c) =>
                          c.id === updatedGroup.id ? updatedGroup : c
                        )
                      });
                    }}
                    onDelete={() => {
                      updatePromotion({
                        conditions: promotion.conditions.filter((c) => c.id !== item.id)
                      });
                    }}
                  />
                ) : (
                  <SortableCondition
                    key={item.id}
                    condition={item}
                    onUpdate={(updatedCondition) => {
                      updatePromotion({
                        conditions: promotion.conditions.map((c) =>
                          c.id === updatedCondition.id ? updatedCondition : c
                        )
                      });
                    }}
                    onDelete={() => {
                      updatePromotion({
                        conditions: promotion.conditions.filter((c) => c.id !== item.id)
                      });
                    }}
                  />
                )
              )}
            </div>
          </SortableContext>
        </DndContext>

        {/* JSON Preview */}
        {xml && (
          <>
            <XmlPreview xml={xml} />
            <JsonPreview promotion={promotion} />
          </>
        )}
      </div>
    </div>
  );
}
