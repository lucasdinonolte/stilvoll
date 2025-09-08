import type { TRule } from '@stilvoll/core';

export const colorRules: Array<TRule> = [
  [
    (name) => `bg-${name}`,
    (value: string) => ({ 'background-color': value }),
    /^--color-background-/,
  ],
  [
    (name) => `text-${name}`,
    (value: string) => ({ color: value }),
    /^--color-text-/,
  ],
];
