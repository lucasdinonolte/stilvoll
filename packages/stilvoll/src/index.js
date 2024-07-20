export const u = new Proxy(
  {},
  {
    get: (_, prop) => {
      return prop;
    },
  },
);
