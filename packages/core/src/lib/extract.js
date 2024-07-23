const splitRE = /[\\:]?[\s'"`;{}(),]+/g;

export const extractClassNamesFromString = ({
  code,
  classNames,
  objectTokensOnly = false,
}) => {
  const res = [];
  const tokens = code.split(splitRE);

  if (code.includes('/* UTILS_SKIP */')) {
    return res;
  }

  for (const token of tokens) {
    if (objectTokensOnly && !token.startsWith('u.')) {
      continue;
    }

    const toks = token.startsWith('u.') ? token.slice(2).split('.') : [token];
    const foundClassNames = [];

    for (const tok of toks) {
      if (classNames.includes(tok)) {
        foundClassNames.push(tok);
      }
    }

    if (foundClassNames.length > 0) {
      res.push({
        isObjectToken: token.startsWith('u.'),
        token,
        classNames: foundClassNames,
      });
    }
  }

  return res;
};
