import { describe, it, expect } from 'vitest';

import { makeRemCalculator, createFluid } from '../src/lib';

describe('makeRemCalculator', () => {
  it('should return a function', () => {
    const remCalculator = makeRemCalculator();
    expect(typeof remCalculator).toBe('function');
  });

  it('should treat numbers as pixel values', () => {
    const remCalculator = makeRemCalculator();
    expect(remCalculator(16)).toBe(1);
    expect(remCalculator(32)).toBe(2);
    expect(remCalculator(0)).toBe(0);
    expect(remCalculator(16.5)).toBe(16.5 / 16);
  });

  it('should handle string pixel values', () => {
    const remCalculator = makeRemCalculator();
    expect(remCalculator('16px')).toBe(1);
    expect(remCalculator('32px')).toBe(2);
    expect(remCalculator('0px')).toBe(0);
    expect(remCalculator('16.5px')).toBe(16.5 / 16);
  });

  it('should handle string rem values', () => {
    const remCalculator = makeRemCalculator();
    expect(remCalculator('1rem')).toBe(1);
    expect(remCalculator('1.5rem')).toBe(1.5);
  });

  it('should throw an error for invalid value', () => {
    const remCalculator = makeRemCalculator();
    expect(() => remCalculator('1em')).toThrow();
  });

  it('should use the base font size', () => {
    const remCalculator = makeRemCalculator(10);
    expect(remCalculator(20)).toBe(2);
  });
});

describe('createFluid', () => {
  it('should return an object with a fluid method', () => {
    const result = createFluid({
      minViewport: '320px',
      maxViewport: '1280px',
      baseFontSize: '16px',
    });
    expect(typeof result.fluid).toBe('function');
  });

  // TODO: Better tests
  it('should work as expected', () => {
    const { fluid } = createFluid({
      minViewport: '320px',
      maxViewport: '1280px',
      baseFontSize: '16px',
    });

    expect(fluid('16px', '32px')).toBe('clamp(1rem, 0.667rem + 1.667vw, 2rem)');
  });
});
