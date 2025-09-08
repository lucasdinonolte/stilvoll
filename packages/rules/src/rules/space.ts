import type { TRule, TRuleValue } from '@stilvoll/core';

const value: TRuleValue = /^--space-/;

export const spacingRules: Array<TRule> = [
  [
    (name) => `m-${name}`,
    (value: string | number) => ({ margin: value }),
    value,
  ],
  [
    (name) => `mx-${name}`,
    (value: string | number) => ({
      'margin-right': value,
      'margin-left': value,
    }),
    value,
  ],
  [
    (name) => `my-${name}`,
    (value: string | number) => ({
      'margin-top': value,
      'margin-bottom': value,
    }),
    value,
  ],
  [
    (name) => `mt-${name}`,
    (value: string | number) => ({ 'margin-top': value }),
    value,
  ],
  [
    (name) => `mr-${name}`,
    (value: string | number) => ({ 'margin-right': value }),
    value,
  ],
  [
    (name) => `mb-${name}`,
    (value: string | number) => ({ 'margin-bottom': value }),
    value,
  ],
  [
    (name) => `ml-${name}`,
    (value: string | number) => ({ 'margin-left': value }),
    value,
  ],
  [
    (name) => `p-${name}`,
    (value: string | number) => ({ padding: value }),
    value,
  ],
  [
    (name) => `px-${name}`,
    (value: string | number) => ({
      'padding-right': value,
      'padding-left': value,
    }),
    value,
  ],
  [
    (name) => `py-${name}`,
    (value: string | number) => ({
      'padding-top': value,
      'padding-bottom': value,
    }),
    value,
  ],
  [
    (name) => `pt-${name}`,
    (value: string | number) => ({ 'padding-top': value }),
    value,
  ],
  [
    (name) => `pr-${name}`,
    (value: string | number) => ({ 'padding-right': value }),
    value,
  ],
  [
    (name) => `pb-${name}`,
    (value: string | number) => ({ 'padding-bottom': value }),
    value,
  ],
  [
    (name) => `pl-${name}`,
    (value: string | number) => ({ 'padding-left': value }),
    value,
  ],
  [
    (name) => `stack-${name}`,
    (value, selector) => `.${selector} > * + * {
  margin-top: ${value};
}`,
    value,
  ],
    [
      (name) => `gap-${name}`,
      (value: string | number) => ({ gap: value }),
      value,
    ],
    [
      (name) => `gap-x-${name}`,
      (value: string | number) => ({ 'column-gap': value }),
      value,
    ],
    [
      (name) => `gap-y-${name}`,
      (value: string | number) => ({ 'row-gap': value }),
      value,
    ],
];
