import { STILVOLL_OBJECT_NAME, STILVOLL_SKIP_COMMENT } from '../constants.js';

const splitRE = /[\\:]?[\s'"`;{}(),]+/g;

/**
 * Extracts stilvoll classnames from a string of code
 */
export const extractClassNamesFromString = ({
  code,
  classNames,
}: {
  code: string;
  classNames: Array<string>;
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
    const toks = token.startsWith(objPrefix)
      ? token.slice(3).split('.')
      : [token];
    const foundClassNames: Array<string> = [];

    if (toks.length === 0) continue;
    if (toks.length > 1) {
      throw new Error(
        `Classname chaining is not supported by stilvoll. Found "${token}"`,
      );
    }

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
