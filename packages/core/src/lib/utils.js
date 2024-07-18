export const capitalizeWord = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const kebabCaseFromArray = (array) => {
  return array
    .map((i) => {
      if (i.toString().length === 0) return null;
      return i.toString().toLowerCase();
    })
    .filter(Boolean)
    .join('-');
};

export const camelCaseFromArray = (array) => {
  return array
    .map((i, index) => {
      if (index === 0) {
        return i.toString().toLowerCase();
      } else {
        return capitalizeWord(i.toString().toLowerCase());
      }
    })
    .join('');
};

export const omit = (_exclude, obj) => {
  const exclude = new Set(_exclude);
  return Object.fromEntries(
    Object.entries(obj).filter((e) => !exclude.has(e[0]))
  );
};
