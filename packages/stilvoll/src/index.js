// Heavily inspired by how typewind does it
const used = (classes = new Set()) => {
  const target = Object.assign(
    {},
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

export const u = new Proxy(
  {},
  {
    get(_, prop) {
      return used()[prop];
    },
  },
);
