const handler = {
  path: [],
  get: function(_, prop) {
    return prop;
  },
};

/**
 * @typedef {Object} Utility Styles
 * @property {string} md_xl
 * @property {string} md_lg
 */

/**
 * @type {Utility}
 */
export const u = new Proxy({}, handler);
