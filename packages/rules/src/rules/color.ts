import type { TRule } from '@stilvoll/core';

export const colorRules = [
  [
    (name) => `bg-${name}`,
    (value: string) => ({ 'background-color': value }),
    { values: { _: /^--color-background-/ } },
  ],
  [
    (name) => `text-${name}`,
    (value: string) => ({ color: value }),
    { values: { _: /^--color-text-/ } },
  ],
] satisfies Array<TRule>;
