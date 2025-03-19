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
import dayjs from 'dayjs'; // Biblioteca para formatar datas
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

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
    sites: [],
    startDate: '',
    endDate: ''
  });

  const [xml, setXml] = useState<string>('');
  const [siteInput, setSiteInput] = useState<string>('siteUS'); // Estado para entrada do site

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

  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return '';

    return dayjs(dateString).utc().format('YYYY-MM-DDTHH:mm');
  };

  const formatDateForStorage = (dateString: string) => {
    if (!dateString) return '';

    return dayjs(dateString).utc().toISOString();
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

  const addSite = () => {
    if (
      siteInput.trim() !== '' &&
      !promotion.sites.some((site) => site.repositoryId === siteInput)
    ) {
      updatePromotion({
        sites: [...promotion.sites, { repositoryId: siteInput.trim() }]
      });
      setSiteInput(''); // Limpar input após adicionar
    }
  };

  const removeSite = (repositoryId: string) => {
    updatePromotion({
      sites: promotion.sites.filter((site) => site.repositoryId !== repositoryId)
    });
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

        {/* Descrição */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
          <input
            className="w-full p-2 border rounded-md"
            value={promotion.description}
            onChange={(e) => updatePromotion({ description: e.target.value })}
          />
        </div>
        {/* Start Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Início (opcional)
          </label>
          <input
            type="datetime-local"
            className="w-full p-2 border rounded-md"
            value={formatDateForInput(promotion.startDate)}
            onChange={(e) => updatePromotion({ startDate: formatDateForStorage(e.target.value) })}
          />
        </div>

        {/* End Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Fim (opcional)
          </label>
          <input
            type="datetime-local"
            className="w-full p-2 border rounded-md"
            value={formatDateForInput(promotion.endDate)}
            onChange={(e) => updatePromotion({ endDate: formatDateForStorage(e.target.value) })}
          />
        </div>

        {/* Sites */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sites Aplicáveis</label>
          <div className="flex space-x-2">
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Digite o ID do site"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSite();
                }
              }}
              value={siteInput}
              onChange={(e) => setSiteInput(e.target.value)}
            />
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={addSite}>
              Adicionar
            </button>
          </div>
          {/* Lista de sites adicionados */}
          <ul className="mt-2">
            {promotion.sites.map((site) => (
              <li
                key={site.repositoryId}
                className="flex justify-between items-center bg-gray-100 p-2 rounded-md mt-2"
              >
                <span>{site.repositoryId}</span>
                <button
                  className="text-red-500 text-sm"
                  onClick={() => removeSite(site.repositoryId)}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Aplicar desconto em */}
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
