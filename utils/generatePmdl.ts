import {
  ComparatorCondition,
  comparatorDataTypeMap,
  OperationCondition,
  OperatorCondition,
  Promotion,
  PromotionCondition,
  QuantifierCondition
} from '@/types/promotion';
import { create } from 'xmlbuilder2';

const buildValue = (value: any, parent: any, isArray: boolean = false) => {
  if (value.type === 'constant') {
    const constant = parent.ele('constant');
    constant.ele('data-type').txt(value.dataType);
    if (Array.isArray(value.value)) {
      value.value.forEach((val: string) => {
        constant.ele('string-value').txt(val);
      });
    } else {
      constant.ele('string-value').txt(value.value?.toString() || '');
    }
  } else if (value.type === 'array') {
    const array = parent.ele('array');
    value.values?.forEach((val: any) => buildValue(val, array));
  } else if (value.type === 'null') {
    parent.ele('null');
  } else {
    parent.ele('value').txt(value.value?.toString() || '');
  }
};

const addCommonAttributes = (condition: PromotionCondition, element: any) => {
  if (condition.attributes) {
    condition.attributes.forEach((attr) => {
      element.att(attr.name, attr.value);
    });
  }
};

const getElementName = (condition: PromotionCondition): string => {
  switch (condition.type) {
    case 'comparator':
      return condition.comparatorType;
    case 'operator':
      return condition.operatorType === 'custom'
        ? condition.customType || 'operator'
        : condition.operatorType;
    case 'quantifier':
      return condition.quantifierType === 'custom'
        ? condition.customType || 'quantifier'
        : condition.quantifierType;
    case 'operation':
      return condition.operationType === 'custom'
        ? condition.customType || 'operation'
        : condition.operationType;
    default:
      return condition.type;
  }
};

const buildOperator = (condition: PromotionCondition, element: any) => {
  const op = condition as OperatorCondition;
  if (op.conditions.length > 0) {
    op.conditions.forEach((child) => buildCondition(child, element));
  } else {
    console.warn('Operador sem condições:', op);
  }
};

const buildQuantifier = (condition: PromotionCondition, element: any) => {
  const quant = condition as QuantifierCondition;
  if (quant.number !== undefined) {
    element.att('number', quant.number.toString());
  }
  element.ele('collection-name').txt(quant.collectionName);
  element.ele('element-name').txt(quant.elementName);
  if (quant.condition) {
    buildCondition(quant.condition, element);
  }
};

const buildOperation = (condition: PromotionCondition, element: any) => {
  const op = condition as OperationCondition;
  if (op.iterators.length > 0) {
    op.iterators.forEach((iterator) => buildCondition(iterator, element));
  } else {
    console.warn('Operação sem iteradores:', op);
  }
};

const buildComparator = (condition: PromotionCondition, element: any) => {
  const comp = condition as ComparatorCondition;

  // Se não tiver um dataType definido, usamos o padrão do mapeamento
  const dataType = comp.dataType || comparatorDataTypeMap[comp.comparatorType] || 'string';

  buildValue({ type: 'value', value: comp.leftValue }, element);

  if (['includes', 'includes-any', 'includes-all'].includes(comp.comparatorType)) {
    buildValue(
      {
        type: 'array',
        values: comp.rightValue.split(',').map((v: string) => ({
          type: 'constant',
          dataType,
          value: v.trim()
        }))
      },
      element
    );
  } else {
    buildValue(
      {
        type: 'constant',
        dataType,
        value: comp.rightValue
      },
      element
    );
  }
};

const buildCondition = (condition: PromotionCondition, parent: any) => {
  if (!condition) return;

  const elementName = getElementName(condition);
  const element = parent.ele(elementName);

  addCommonAttributes(condition, element);

  switch (condition.type) {
    case 'comparator':
      buildComparator(condition, element);
      break;

    case 'iterator':
      if (condition.number !== undefined) element.att('number', condition.number.toString());
      if (condition.sortBy) element.att('sort-by', condition.sortBy);
      if (condition.sortOrder) element.att('sort-order', condition.sortOrder);
      element.ele('collection-name').txt(condition.collectionName);
      element.ele('element-name').txt(condition.elementName);
      if (condition.condition) buildCondition(condition.condition, element);
      break;

    case 'operator':
      buildOperator(condition, element);
      break;

    case 'quantifier':
      buildQuantifier(condition, element);
      break;

    case 'operation':
      buildOperation(condition, element);
      break;

    case 'group-iterator':
      if (condition.number !== undefined) element.att('number', condition.number.toString());
      if (condition.conditions?.length) {
        condition.conditions.forEach((child) => buildCondition(child, element));
      }
      break;

    default:
      console.warn('Tipo de condição não suportado:', condition);
  }
};

export const generatePmdl = (promotion: Promotion): string => {
  const root = create({ version: '1.0' }).ele('pricing-model');

  // Construir qualificador
  if (promotion.qualifier || promotion.conditions.length > 0) {
    const qualifier = root.ele('qualifier');

    if (promotion.qualifier) {
      buildCondition(promotion.qualifier, qualifier);
    }

    promotion.conditions.forEach((condition) => {
      buildCondition(condition, qualifier);
    });
  }

  // Construir oferta
  if (promotion.offer?.discountStructures?.length > 0) {
    const offer = root.ele('offer');

    promotion.offer.discountStructures.forEach((ds) => {
      offer
        .ele('discount-structure')
        .att('calculator-type', ds.calculatorType)
        .att('discount-type', ds.discountType)
        .att('adjuster', ds.adjuster.toString());
    });
  }

  return root.end({ prettyPrint: true, headless: true });
};
