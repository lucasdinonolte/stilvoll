import type { TRule } from '@stilvoll/core';

export const gridRules = [
  ['grid', { display: 'grid' }],
  [
    (count: string) => `grid-cols-${count}`,
    (value: number) => ({
      'grid-template-columns': `repeat(${value}, minmax(0, 1fr))`,
    }),
    {
      values: {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        11: 11,
        12: 12,
      },
    },
  ],
  ['col-auto', { 'grid-column': 'auto' }],
  ['col-span-full', { 'grid-column': '1 / -1' }],
  [
    (count: string) => `col-span-${count}`,
    (value: number) => ({
      'grid-column': `span ${value} / span ${value}`,
    }),
    {
      values: {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        11: 11,
        12: 12,
      },
    },
  ],
  ['col-start-auto', { 'grid-column-start': 'auto' }],
  [
    (count: string) => `col-start-${count}`,
    (value: number) => ({
      'grid-column-start': value,
    }),
    {
      values: {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        11: 11,
        12: 12,
        13: 13,
      },
    },
  ],
  ['col-end-auto', { 'grid-column-end': 'auto' }],
  [
    (count: string) => `col-start-${count}`,
    (value: number) => ({
      'grid-column-end': value,
    }),
    {
      values: {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        11: 11,
        12: 12,
        13: 13,
      },
    },
  ],
] satisfies Array<TRule>;
