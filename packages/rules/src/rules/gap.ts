import type { TRule } from '@stilvoll/core';

const values = {
  _: /^--space-/,
};

export const gapRules = [
  [
    (name) => `gap-${name}`,
    (value: string | number) => ({ gap: value }),
    { values },
  ],
  [
    (name) => `gap-x-${name}`,
    (value: string | number) => ({ 'column-gap': value }),
    { values },
  ],
  [
    (name) => `gap-y-${name}`,
    (value: string | number) => ({ 'row-gap': value }),
    { values },
  ],
] satisfies Array<TRule>;
