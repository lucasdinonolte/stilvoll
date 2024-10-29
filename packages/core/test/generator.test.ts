import type { TBreakpoint, TRule } from '../src/types';
import { generateUtilities } from '../src/lib/generator';
import { describe, expect, it } from 'vitest';

const sampleBreakpoints: Array<TBreakpoint> = [
  { name: 'sm', media: '@media (min-width: 640px)' },
  { name: 'md', media: '@media (min-width: 768px)' },
  { name: 'lg', media: '@media (min-width: 1024px)' },
  { name: 'xl', media: '@media (min-width: 1280px)' },
];

const classNameFormatter = ({ breakpoint, className }) =>
  `${breakpoint}:${className}`;

describe('generateUtilities', () => {
  const responsiveRule: TRule = ['flex', { display: 'flex' }];
  const nonResponsiveRule: TRule = [
    'flex',
    { display: 'flex' },
    { responsive: false },
  ];

  it('should generate utilities', () => {
    const res = generateUtilities({
      rules: [responsiveRule, nonResponsiveRule],
      customProperties: [],
      breakpoints: [],
      classNameFormatter,
    });

    expect(res.length).toBe(2);
  });

  it('should return an empty array if no rules are provided', () => {
    const res = generateUtilities({
      rules: [],
      customProperties: [],
      breakpoints: sampleBreakpoints,
      classNameFormatter,
    });

    expect(res).toEqual([]);
  });

  it('should generate responsive utilities when breakpoints are given', () => {
    const res = generateUtilities({
      rules: [responsiveRule],
      customProperties: [],
      breakpoints: sampleBreakpoints,
      classNameFormatter,
    });

    expect(res.length).toBe(1 + sampleBreakpoints.length);
  });

  it('should skip responsive styles for rules with responsive option set to false', () => {
    const res = generateUtilities({
      rules: [nonResponsiveRule],
      customProperties: [],
      breakpoints: sampleBreakpoints,
      classNameFormatter,
    });

    expect(res.length).toBe(1);
  });
});