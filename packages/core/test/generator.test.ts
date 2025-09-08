import type { TBreakpoint, TRule } from '../src/types';
import { generateCSS, generateUtilities } from '../src/lib/generator';
import { describe, expect, it } from 'vitest';

const sampleBreakpoints: Array<TBreakpoint> = [
  { name: 'sm', media: '@media (min-width: 640px)' },
  { name: 'md', media: '@media (min-width: 768px)' },
  { name: 'lg', media: '@media (min-width: 1024px)' },
  { name: 'xl', media: '@media (min-width: 1280px)' },
];

const sampleCustomProperties = [
  {
    key: '--space-xl',
    value: 'var(--space-xl)',
  },
  {
    key: '--space-l',
    value: 'var(--space-l)',
  },
];

const classNameFormatter = ({ breakpoint, className }) =>
  breakpoint ? `${breakpoint}:${className}` : className;

describe('generators', () => {
  const responsiveRule: TRule = ['flex', { display: 'flex' }];
  const nonResponsiveRule: TRule = [
    'flex',
    { display: 'flex' },
    { responsive: false },
  ];

  const ruleWithValues: TRule = [
    (name) => `space-${name}`,
    (value: string) => ({ margin: value }),
    /^--space-/,
  ];

  const ruleWithCustomAndStaticValues: TRule = [
    (name) => `space-${name}`,
    (value: string) => ({ margin: value }),
    [/^--space-/, ['none', 0]],
  ];

  describe('generateUtilities', () => {
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

    it('should generate dynamic rules for custom properties', () => {
      const res = generateUtilities({
        rules: [ruleWithValues],
        customProperties: sampleCustomProperties,
        breakpoints: [],
        classNameFormatter,
      });

      expect(res.length).toBe(sampleCustomProperties.length);
    });

    it('should generate dynamic rules for custom properties and static values', () => {
      const res = generateUtilities({
        rules: [ruleWithCustomAndStaticValues],
        customProperties: sampleCustomProperties,
        breakpoints: [],
        classNameFormatter,
      });

      expect(res.length).toBe(sampleCustomProperties.length + 1);
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

  describe('generateCSS', () => {
    const utilities = generateUtilities({
      rules: [responsiveRule],
      customProperties: [],
      breakpoints: [],
      classNameFormatter,
    });

    it('should produce CSS', () => {
      const res = generateCSS(utilities, [], {});
      expect(res).toBe('.flex { display: flex; }');
    });

    it('should wrap produced CSS in cascade layer', () => {
      const res = generateCSS(utilities, [], { cascadeLayer: 'utilities' });
      expect(res).toBe('@layer utilities { .flex { display: flex; } }');
    });

    it('should apply the supplied banner', () => {
      const res = generateCSS(utilities, [], { banner: '/* Banner */' });
      expect(res).toBe('/* Banner */ .flex { display: flex; }');
    });

    it('should only output the classes passed in', () => {
      const utilities = generateUtilities({
        rules: [responsiveRule, ['hidden', { display: 'none' }]],
        customProperties: [],
        breakpoints: [],
        classNameFormatter,
      });

      const res = generateCSS(utilities, ['hidden'], {});
      expect(res).toBe('.hidden { display: none; }');
    });
  });
});
