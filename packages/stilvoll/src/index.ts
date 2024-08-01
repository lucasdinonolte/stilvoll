import type { UtilityMap } from './types';

// Heavily inspired by how typewind does it
// to allow for chaining of classes
const used = (classes = new Set()) => {
  const target = Object.assign(
    () => {},
    {
      classes,
      [Symbol.toPrimitive]() {
        const cls = [...target.classes];
        return cls.join(' ');
      },
    },
  );

  const u = new Proxy(target, {
    get: (target, prop) => {
      if (
        prop === 'toString' ||
        prop === 'valueOf' ||
        prop === 'toJSON' ||
        prop === Symbol.toPrimitive
      ) {
        return target[Symbol.toPrimitive];
      }

      if (typeof prop !== 'string') return null;
      target.classes.add(prop);

      return u;
    },
    getPrototypeOf() {
      return String.prototype;
    },
  });

  return u;
};

export const sv = new Proxy(
  {},
  {
    get(_, prop) {
      return used()[prop];
    },
  },
) as UtilityMap;
