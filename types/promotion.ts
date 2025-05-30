export type ConditionType =
  | 'comparator'
  | 'iterator'
  | 'group-iterator'
  | 'quantifier'
  | 'operator'
  | 'operation';

export type ConditionBase = {
  id: string;
  type: ConditionType;
  attributes?: Array<{ name: string; value: string }>;
};

export type ComparatorCondition = ConditionBase & {
  type: 'comparator';
  comparatorType:
    | 'equals'
    | 'not-equals'
    | 'less-than'
    | 'less-than-or-equals'
    | 'greater-than'
    | 'greater-than-or-equals'
    | 'contains'
    | 'starts-with'
    | 'ends-with'
    | 'isoneof'
    | 'isnotoneof'
    | 'includes'
    | 'includes-any'
    | 'includes-all';
  leftValue: string;
  rightValue: string;
  dataType: string;
};

export type ValueType = {
  type: 'value' | 'constant' | 'array' | 'null';
  dataType?: string;
  value?: string | number | boolean;
  values?: ValueType[];
};
export type IteratorCondition = ConditionBase & {
  type: 'iterator';
  iteratorType: 'next' | 'every' | 'up-to-and-including' | 'custom';
  collectionName: string;
  elementName: string;
  number?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  condition?: PromotionCondition;
};

export type GroupIteratorCondition = ConditionBase & {
  type: 'group-iterator';
  iteratorType: 'every-group' | 'up-to-and-including-group' | 'custom';
  number?: number;
  conditions?: PromotionCondition[];
};

export type QuantifierCondition = ConditionBase & {
  type: 'quantifier';
  quantifierType: 'exactly' | 'at-least' | 'at-most' | 'all' | 'custom';
  number?: number;
  collectionName: string;
  elementName: string;
  condition?: PromotionCondition;
  customType?: string;
};

export type OperatorCondition = ConditionBase & {
  type: 'operator';
  operatorType: 'and' | 'or' | 'not' | 'custom';
  conditions: PromotionCondition[];
  customType?: string; // Para operadores personalizados
};

export const comparatorDataTypeMap: Record<string, string> = {
  equals: 'java.lang.String',
  'not-equals': 'java.lang.String',
  'greater-than': 'java.lang.Double',
  'greater-than-or-equals': 'java.lang.Double',
  'less-than': 'java.lang.Double',
  'less-than-or-equals': 'java.lang.Double',
  contains: 'java.lang.String',
  'starts-with': 'java.lang.String',
  'ends-with': 'java.lang.String',
  isoneof: 'java.util.List',
  isnotoneof: 'java.util.List',
  includes: 'java.util.List',
  'includes-any': 'java.util.List',
  'includes-all': 'java.util.List'
};

export type OperationCondition = ConditionBase & {
  type: 'operation';
  operationType: 'union' | 'anded-union' | 'custom';
  iterators: PromotionCondition[];
  customType?: string;
};
export type PromotionCondition =
  | ComparatorCondition
  | IteratorCondition
  | GroupIteratorCondition
  | QuantifierCondition
  | OperatorCondition
  | OperationCondition;

export type DiscountStructure = {
  calculatorType: string;
  discountType: 'percentOff' | 'amountOff' | 'fixedPrice';
  adjuster: number;
  target?: 'order' | 'shipping' | 'item';
};

export type Offer = {
  discountStructures: DiscountStructure[];
};

export type Promotion = {
  displayName: string;
  description: string;
  enabled: boolean;
  priority: number;
  qualifier: PromotionCondition | undefined;
  offer: Offer;
  conditions: PromotionCondition[];
  sites: Array<{ repositoryId: string }>;
  priceListGroups: string[];
  startDate?: string;
  endDate?: string;
  templatePath?: string;
  templateName?: string;
  templateValues?: { [key: string]: any };
};
