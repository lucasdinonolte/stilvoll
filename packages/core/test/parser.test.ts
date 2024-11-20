import { describe, expect, it } from 'vitest';
import { parseInputCSS } from '../src/lib/parser.js';

describe('parseInputCSS', () => {
  it('should detect custom properties in input code', () => {
    const inputCode = `:root {
  --font-family: "Poppins", "Helvetica", "Arial", sans-serif;
  --color-black-rgb: 32, 36, 32;
  --color-green: rgb(var(--color-green-rgb));
  --color-white: rgb(var(--color-white-rgb));
  --space-l: 10px;
}`;
    const res = parseInputCSS(inputCode);
    expect(res.customProperties).toHaveLength(5);
    expect(res.foundBreakpoints).toEqual({});
  });

  it('should detect custom media queries in input code', () => {
    const inputCode = `@custom-media --sm (max-width: 30em);
@custom-media --md (max-width: 30em);
@custom-media --complex (orientation: portrait) and (max-width: 30em);
@media screen and (min-width: 640px) {
  /* This should be ignored */
  .class {
    display: flex;
  }`;

    const res = parseInputCSS(inputCode);

    expect(res.foundBreakpoints).toHaveProperty('sm');
    expect(res.foundBreakpoints.sm).toBe('@media (max-width: 30em)');
    expect(res.foundBreakpoints).toHaveProperty('md');
    expect(res.foundBreakpoints.md).toBe('@media (max-width: 30em)');
    expect(res.foundBreakpoints).toHaveProperty('complex');
    expect(res.foundBreakpoints.complex).toBe(
      '@media (orientation: portrait) and (max-width: 30em)',
    );
  });
});
