import type { TRule } from '@stilvoll/core';

export const visibilityRules = [
  ['inline', { display: 'inline' }],
  ['block', { display: 'block' }],
  ['inline-block', { display: 'inline-block' }],
  ['hidden', { display: 'none' }],
  ['visible', { visibility: 'visible' }],
  ['invisible', { visibility: 'hidden' }],
  [
    'truncate',
    {
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
    },
  ],
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
] satisfies Array<TRule>;
