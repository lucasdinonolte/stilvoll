import type { ClassValue } from './types';

/**
 * Ported from clsx, with added support for turning
 * stilvoll objects into strings.
 *
 * License: MIT
 * Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
 */
const toVal = (mix: ClassValue): string => {
  let k: number;
  let y: string;
  let str = '';

  if (mix === null || mix === undefined) return '';

  if (
    typeof mix === 'string' ||
    typeof mix === 'number' ||
    // Treat stilvoll objects as if they were strings
    Object.getPrototypeOf(mix) === String.prototype
  ) {
    str += mix.toString();
  } else if (typeof mix === 'object') {
    if (Array.isArray(mix)) {
      var len = mix.length;
      for (k = 0; k < len; k++) {
        if (mix[k]) {
          if ((y = toVal(mix[k]))) {
            str && (str += ' ');
            str += y.toString();
          }
        }
      }
    } else {
      for (y in mix) {
        if (mix[y]) {
          str && (str += ' ');
          str += y.toString();
        }
      }
    }
  }

  return str;
};

export const cn = (...inputs: ClassValue[]): string => {
  let i = 0;
  let tmp: ClassValue;
  let x: string;
  let str = '';
  const len = inputs.length;

  for (; i < len; i++) {
    if ((tmp = inputs[i])) {
      if ((x = toVal(tmp))) {
        str && (str += ' ');
        str += x.toString();
      }
    }
  }
  return str;
};
