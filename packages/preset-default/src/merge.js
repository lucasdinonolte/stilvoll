export const deepMerge = (a, b) => {
  const merged = { ...a };
  for (const key in b) {
    if (typeof b[key] === 'object' && typeof a[key] === 'object') {
      merged[key] = deepMerge(a[key], b[key]);
    } else {
      merged[key] = b[key];
    }
  }
  return merged;
};

export const deepMergeAll = (...args) => args.reduce(deepMerge, {});
