export const capitalizeWord = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const kebabCaseFromArray = (array) => {
  return array
    .map((w) => w.replaceAll('_', '-').split('-'))
    .flat()
    .map((i) => {
      if (i.toString().length === 0) return null;
      return i.toString().toLowerCase();
    })
    .filter(Boolean)
    .join('-');
};

export const snakeCaseFromArray = (array) => {
  return array
    .map((w) => w.replaceAll('_', '-').split('-'))
    .flat()
    .map((i) => {
      if (i.toString().length === 0) return null;
      return i.toString().toLowerCase();
    })
    .filter(Boolean)
    .join('_');
};

export const camelCaseFromArray = (array) => {
  return array
    .map((w) => w.split('-'))
    .flat()
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
    Object.entries(obj).filter((e) => !exclude.has(e[0])),
  );
};

export const uniqueArray = (array) => {
  return [...new Set(array)];
};

export const hashClassName = (input) =>
  `u${input
    .split('')
    .reduce((hash, char) => (hash << 5) - hash + char.charCodeAt(0), 0)
    .toString(36)
    .slice(0, 8)}`;

export const ensureBuffer = (input: string | Buffer): Buffer => {
  if (typeof input === 'string') return Buffer.from(input);
  return input;
};

export const notNull = (i: any) => i !== null && i !== undefined;
export const nonEmpty = (s: string) => s !== '';
