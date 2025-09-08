import type { TRule, TRuleValue } from '@stilvoll/core';

export const makeGridRules = (columnCount: number) => {
const columns: Array<TRuleValue> = Array.from({ length: columnCount }).map((_, i) => [`${i + 1}`, i + 1]);

const res: Array<TRule> = [
  [
    (count: string) => `grid-cols-${count}`,
    (value: number) => ({
      display: 'grid',
      'grid-template-columns': `repeat(${value}, minmax(0, 1fr))`,
    }),
    columns,
  ],
  ['col-auto', { 'grid-column': 'auto' }],
  ['col-full', { 'grid-column': '1 / -1' }],
  [
    (count: string) => `col-${count}`,
    (value: number) => ({
      'grid-column': `span ${value} / span ${value}`,
    }),
    columns,
  ],
  ['col-start-auto', { 'grid-column-start': 'auto' }],
  [
    (count: string) => `col-start-${count}`,
    (value: number) => ({
      'grid-column-start': value,
    }),
    columns,
  ],
  ['col-end-auto', { 'grid-column-end': 'auto' }],
  [
    (count: string) => `col-end-${count}`,
    (value: number) => ({
      'grid-column-end': value,
    }),
    columns,
  ],
];
return res;
};

export const gridRules = makeGridRules(12);
