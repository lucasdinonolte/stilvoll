import { expect, describe, it } from 'vitest';
import { sv } from '../src/index';

describe('sv proxy', () => {
  it('returns a proxy object', () => {
    expect(sv).toBeInstanceOf(Object);
  });

  it('stringifies classes', () => {
    expect(sv.bgRed.toString()).toBe('bgRed');
  });
});
