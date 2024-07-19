const splitRE = /[\\:]?[\s'"`;{}(),]+/g;

export const extractClassNamesFromString = (code, classNames) => {
  const res = [];
  const tokens = code.split(splitRE);

  if (code.includes('/* UTILS_SKIP */')) {
    return res;
  }

  for (const token of tokens) {
    const tok = (token.startsWith('u.') ? token.slice(2) : token);
    if (classNames.includes(tok)) {
      res.push(tok);
    }
  }

  return res;
}
