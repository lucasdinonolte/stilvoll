const defaultSettings = {};

export const mergeWithDefaultSettings = (settings = {}) =>
  Object.assign({}, defaultSettings, settings);
