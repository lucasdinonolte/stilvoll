const defaultSettings = {
  columns: 12,
};

export const mergeWithDefaultSettings = (settings = {}) =>
  Object.assign({}, defaultSettings, settings);
