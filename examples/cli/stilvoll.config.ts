import { createConfig } from '@stilvoll/core';
const columns = Array.from({ length: 12 }).map((_, i) => [i + 1, i + 1]);

export default createConfig({
  input: ['./src/input.css'],
  output: './dist/utils.css',
  entries: [],
  banner: () => `/* AUTO GENERATED ON ${new Date().toISOString()} */`,
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
  minifyOutput: false,
  rules: [
    [
      (name) => `m-${name}`,
      (value: string | number) => ({ margin: value }),
      /^--space-/,
    ],
    [
      (name) => `mx-${name}`,
      (value: string | number) => ({ 'margin-inline': value }),
      /^--space-/,
    ],
    [
      (name) => `my-${name}`,
      (value: string | number) => ({ 'margin-block': value }),
      /^--space-/,
    ],
    [
      (name) => `mt-${name}`,
      (value: string | number) => ({ 'margin-top': value }),
      /^--space-/,
    ],
    [
      (name) => `mr-${name}`,
      (value: string | number) => ({ 'margin-right': value }),
      /^--space-/,
    ],
    [
      (name) => `mb-${name}`,
      (value: string | number) => ({ 'margin-bottom': value }),
      /^--space-/,
    ],
    [
      (name) => `ml-${name}`,
      (value: string | number) => ({ 'margin-left': value }),
      /^--space-/,
    ],
    [
      (name) => `p-${name}`,
      (value: string | number) => ({ padding: value }),
      /^--space-/,
    ],
    [
      (name) => `px-${name}`,
      (value: string | number) => ({ 'padding-inline': value }),
      /^--space-/,
    ],
    [
      (name) => `py-${name}`,
      (value: string | number) => ({ 'padding-block': value }),
      /^--space-/,
    ],

    [
      (name) => `pt-${name}`,
      (value: string | number) => ({ 'padding-top': value }),
      /^--space-/,
    ],
    [
      (name) => `pr-${name}`,
      (value: string | number) => ({ 'padding-right': value }),
      /^--space-/,
    ],
    [
      (name) => `pb-${name}`,
      (value: string | number) => ({ 'padding-bottom': value }),
      /^--space-/,
    ],
    [
      (name) => `pl-${name}`,
      (value: string | number) => ({ 'padding-left': value }),
      /^--space-/,
    ],
    [
      (name) => `stack-${name}`,
      (value, selector) => `.${selector} > * + * {
  margin-top: ${value};
}`,
      /^--space-/,
    ],
    [
      (name) => `gap-${name}`,
      (value: string | number) => ({ gap: value }),
      /^--space-/,
    ],
    [
      (name) => `gap-x-${name}`,
      (value: string | number) => ({ 'column-gap': value }),
      /^--space-/,
    ],
    [
      (name) => `gap-y-${name}`,
      (value: string | number) => ({ 'row-gap': value }),
      /^--space-/,
    ],
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
    ['flex', { display: 'flex' }],
    ['flex-wrap', { 'flex-wrap': 'wrap' }],
    ['flex-nowrap', { 'flex-wrap': 'nowrap' }],
    ['justify-start', { 'justify-content': 'flex-start' }],
    ['justify-end', { 'justify-content': 'flex-end' }],
    ['justify-center', { 'justify-content': 'center' }],
    ['justify-between', { 'justify-content': 'space-between' }],
    ['justify-around', { 'justify-content': 'space-around' }],
    ['justify-evenly', { 'justify-content': 'space-evenly' }],
    ['justify-stretch', { 'justify-content': 'stretch' }],
    ['justify-left', { 'justify-content': 'left' }],
    ['justify-right', { 'justify-content': 'right' }],
    ['items-start', { 'align-items': 'flex-start' }],
    ['items-end', { 'align-items': 'flex-end' }],
    ['items-center', { 'align-items': 'center' }],
    ['items-baseline', { 'align-items': 'baseline' }],
    ['items-stretch', { 'align-items': 'stretch' }],
    ['hidden', { display: 'none' }],
    ['visible', { visibility: 'visible' }],
    ['invisible', { visibility: 'hidden' }],
    [
      'sr-only',
      {
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        'white-space': 'nowrap',
        border: '0',
      },
    ],
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
  ],
});
