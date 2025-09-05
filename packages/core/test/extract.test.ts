import { describe, expect, it } from 'vitest';
import { extractClassNamesFromString } from '../src/lib/extract.js';
import {
  STILVOLL_OBJECT_NAME,
  STILVOLL_SKIP_COMMENT,
} from '../src/constants.js';

describe('extractClassNamesFromString', () => {
  const classNames = ['classA', 'classB', 'classC'];

  it('should extract classnames from a string of code', () => {
    const code = '<div class="classA classB someOtherText">Hello</div>';
    const res = extractClassNamesFromString({ code, classNames });
    expect(res).toHaveLength(2);
  });

  it('should extract regexp classnames from a string of code', () => {
    const code = '<div class="m-4 p-2">Hello</div>';
    const res = extractClassNamesFromString({
      code,
      classNames: [/^m-(\d+)$/, /^p-(\d+)$/],
    });
    expect(res).toHaveLength(2);
  });

  it('should return an empty array if no matches are found', () => {
    const code = '<div class="nonMatchingClass someOtherText">Hello</div>';
    const res = extractClassNamesFromString({ code, classNames });
    expect(res).toHaveLength(0);
  });

  it('should ignore comments with STILVOLL_SKIP_COMMENT', () => {
    const code = `// ${STILVOLL_SKIP_COMMENT} classA classB`;
    const result = extractClassNamesFromString({ code, classNames });
    expect(result).toHaveLength(0);
  });

  it('should handle object tokens correctly', () => {
    const code = `<div className={cn(${STILVOLL_OBJECT_NAME}.classA, ${STILVOLL_OBJECT_NAME}.classB, ${STILVOLL_OBJECT_NAME}.nonMatchingClass)}></div>`;
    const result = extractClassNamesFromString({ code, classNames });
    expect(result).toHaveLength(2);
  });

  it('should throw an error for classname chaining', () => {
    const code = `<div className={${STILVOLL_OBJECT_NAME}.classA.classB.nonMatchingClass}></div>`;

    expect(() => extractClassNamesFromString({ code, classNames })).toThrow();
  });
});
