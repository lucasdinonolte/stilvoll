import type { TRule } from '@stilvoll/core';

export const flexRules: Array<TRule> = [
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
];
