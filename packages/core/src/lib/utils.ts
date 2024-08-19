export const uniqueArray = (array) => {
  return [...new Set(array)];
};

export const ensureBuffer = (input: string | Buffer): Buffer => {
  if (typeof input === 'string') return Buffer.from(input);
  return input;
};

/**
 * Minifies a string of CSS
 */
export const minify = (input: string): string =>
  input.replace(/\s+/g, ' ').trim();
