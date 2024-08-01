import { expect, describe, it } from 'vitest';
import { sv } from '../src/index';

describe('sv proxy', () => {
  it('returns a proxy object', () => {
    expect(sv).toBeInstanceOf(Object);
    expect(sv.bgRed).toBeInstanceOf(Object);
  });

  it('stringifies classes', () => {
    expect(sv.bgRed.toString()).toBe('bgRed');
  });

  it('chains classes', () => {
    expect(sv.bgRed.textWhite.toString()).toBe('bgRed textWhite');
  });

  it('JSON.stringify works', () => {
    expect(JSON.stringify(sv.bgRed.textWhite)).toBe('"bgRed textWhite"');
  });
});
