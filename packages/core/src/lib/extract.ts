import { STILVOLL_OBJECT_NAME, STILVOLL_SKIP_COMMENT } from '../constants.js';

const splitRE = /[\\:]?[\s'"`;{}(),]+/g;

export const extractClassNamesFromString = ({
  code,
  classNames,
  objectTokensOnly = false,
}: {
  code: string;
  classNames: Array<string>;
  objectTokensOnly: boolean;
}) => {
  const res: Array<{
    isObjectToken: boolean;
    token: string;
    classNames: Array<string>;
  }> = [];
  const tokens = code.split(splitRE);

  const objPrefix = `${STILVOLL_OBJECT_NAME}.`;

  if (code.includes(STILVOLL_SKIP_COMMENT)) {
    return res;
  }

  for (const token of tokens) {
    if (objectTokensOnly && !token.startsWith(objPrefix)) {
      continue;
    }

    const toks = token.startsWith(objPrefix)
      ? token.slice(2).split('.')
      : [token];
    const foundClassNames: Array<string> = [];

    for (const tok of toks) {
      if (classNames.includes(tok)) {
        foundClassNames.push(tok);
      }
    }

    if (foundClassNames.length > 0) {
      res.push({
        isObjectToken: token.startsWith(objPrefix),
        token,
        classNames: foundClassNames,
      });
    }
  }

  return res;
};
