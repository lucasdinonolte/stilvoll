import type { TRule } from '@stilvoll/core';

export const visibilityRules = [
  ['inline', { display: 'inline' }],
  ['block', { display: 'block' }],
  ['inline-block', { display: 'inline-block' }],
  ['contents', { display: 'contents' }],
  ['flow-root', { display: 'flow-root' }],
  ['list-item', { display: 'list-item' }],
  ['hidden', { display: 'none' }],
  ['visible', { visibility: 'visible' }],
  ['invisible', { visibility: 'hidden' }],
  ['backface-visible', { 'backface-visibility': 'visible' }],
  ['backface-hidden', { 'backface-visibility': 'hidden' }],
  ['select-auto', { '-webkit-user-select': 'auto', 'user-select': 'auto' }],
  ['select-all', { '-webkit-user-select': 'all', 'user-select': 'all' }],
  ['select-text', { '-webkit-user-select': 'text', 'user-select': 'text' }],
  ['select-none', { '-webkit-user-select': 'none', 'user-select': 'none' }],
  [
    'truncate',
    {
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
    },
  ],
  ['text-clip', { 'text-overflow': 'clip' }],
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
