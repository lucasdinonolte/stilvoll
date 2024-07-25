export const isClient =
  typeof window !== 'undefined' &&
  typeof navigator !== 'undefined' &&
  typeof document !== 'undefined';
export const isServer = !isClient;

export function uid(prefix = 'comp') {
  return prefix + '-' + Math.random().toString(36).substring(2, 16);
}
