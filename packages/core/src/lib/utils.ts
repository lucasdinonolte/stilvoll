export const uniqueArray = (array) => {
  return [...new Set(array)];
};

export const ensureBuffer = (input: string | Buffer): Buffer => {
  if (typeof input === 'string') return Buffer.from(input);
  return input;
};

/**
 * Minifies a string of CSS by collapsing all whitespace
 * down to a single space.
 */
export const minify = (input: string): string =>
  input.replace(/\s+/g, ' ').trim();

/**
 * Indents a chunk of text
 */
export const indent = (input: string, depth: number = 1, indentationCharacter: string = '  ') => {
  return input.split('\n').map(line => 
                               `${Array.from({ length: depth }).fill(indentationCharacter).join()}${line}`
                              ).join('\n');
}
