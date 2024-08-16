import type { TRule } from '@stilvoll/core';

const values = {
  auto: 'auto',
  none: 0,
  px: '1px',
  _: /^--space-/,
};

export const spacingRules = [
  [
    (name) => `m-${name}`,
    (value: string | number) => ({ margin: value }),
    { values },
  ],
  [
    (name) => `mx-${name}`,
    (value: string | number) => ({
      'margin-right': value,
      'margin-left': value,
    }),
    { values },
  ],
  [
    (name) => `my-${name}`,
    (value: string | number) => ({
      'margin-top': value,
      'margin-bottom': value,
    }),
    { values },
  ],
  [
    (name) => `mt-${name}`,
    (value: string | number) => ({ 'margin-top': value }),
    { values },
  ],
  [
    (name) => `mr-${name}`,
    (value: string | number) => ({ 'margin-right': value }),
    { values },
  ],
  [
    (name) => `mb-${name}`,
    (value: string | number) => ({ 'margin-bottom': value }),
    { values },
  ],
  [
    (name) => `ml-${name}`,
    (value: string | number) => ({ 'margin-left': value }),
    { values },
  ],
  [
    (name) => `p-${name}`,
    (value: string | number) => ({ padding: value }),
    { values },
  ],
  [
    (name) => `px-${name}`,
    (value: string | number) => ({
      'padding-right': value,
      'padding-left': value,
    }),
    { values },
  ],
  [
    (name) => `py-${name}`,
    (value: string | number) => ({
      'padding-top': value,
      'padding-bottom': value,
    }),
    { values },
  ],
  [
    (name) => `pt-${name}`,
    (value: string | number) => ({ 'padding-top': value }),
    { values },
  ],
  [
    (name) => `pr-${name}`,
    (value: string | number) => ({ 'padding-right': value }),
    { values },
  ],
  [
    (name) => `pb-${name}`,
    (value: string | number) => ({ 'padding-bottom': value }),
    { values },
  ],
  [
    (name) => `pl-${name}`,
    (value: string | number) => ({ 'padding-left': value }),
    { values },
  ],
  [
    (name) => `stack-${name}`,
    (value, selector) => `.${selector} > * + * {
  margin-top: ${value};
}`,
    { values },
  ],
] satisfies Array<TRule>;
