import { DiscountStructure } from '@/types/promotion';

type DiscountFormProps = {
  discount?: DiscountStructure; // Agora pode ser opcional
  onChange: (discount: DiscountStructure) => void;
};

export const DiscountForm = ({
  discount = { calculatorType: '', discountType: 'percentOff', adjuster: 0 },
  onChange
}: DiscountFormProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">💰 Configurar Desconto</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tipo de Desconto */}
        <div className="space-y-2">
          <label htmlFor="discountType" className="block text-sm font-medium text-gray-600">
            Tipo de Desconto
          </label>
          <select
            id="discountType"
            className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500"
            value={discount.discountType}
            onChange={(e) =>
              onChange({
                ...discount,
                discountType: e.target.value as 'percentOff' | 'amountOff' | 'fixedPrice'
              })
            }
          >
            <option value="percentOff">Porcentagem (%)</option>
            <option value="amountOff">Valor Fixo (R$)</option>
            <option value="fixedPrice">Preço Fixo</option>
          </select>
        </div>

        {/* Valor do Desconto */}
        <div className="space-y-2">
          <label htmlFor="discountValue" className="block text-sm font-medium text-gray-600">
            {discount.discountType === 'percentOff'
              ? 'Porcentagem'
              : discount.discountType === 'fixedPrice'
                ? 'Preço Final'
                : 'Valor'}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {discount.discountType === 'percentOff' ? '%' : 'R$'}
            </span>
            <input
              id="discountValue"
              type="number"
              className="w-full p-2 pl-8 border rounded-md"
              placeholder={discount.discountType === 'percentOff' ? 'Ex: 10' : 'Ex: 50'}
              value={discount.adjuster ?? ''}
              min="0"
              step={discount.discountType === 'percentOff' ? '1' : '0.01'}
              onChange={(e) => onChange({ ...discount, adjuster: Number(e.target.value) || 0 })}
            />
          </div>
        </div>
      </div>

      {/* Dica Contextual */}
      <p className="mt-3 text-sm text-gray-500">
        {discount.discountType === 'percentOff'
          ? 'O desconto será aplicado como porcentagem sobre o total.'
          : discount.discountType === 'fixedPrice'
            ? 'O preço final será definido para este valor.'
            : 'O valor fixo será subtraído do total do pedido.'}
      </p>
    </div>
  );
};
