import type { TConfig, TParseResult } from '../types';

import { parseInputCSS, transformBreakpoints } from './parser';
import { formatters } from './formatters';
import { mergeWithDefaultConfig } from './options';
import {
  generateUtilities,
  generateCSS,
  generateTypeDefinitions,
} from './generator';

/**
 * Extracts tokens from CSS custom properties and turns
 * them into utiliy css classes as well as a map to look
 * up utiliy classes, so you can import and use them the
 * same way as CSS Modules, making combining component
 * CSS with utility CSS more ergonomic.
 */
export const parseTokensToUtilities = ({
  code,
  options: _options = {},
}: {
  code: string | Buffer;
  options: Partial<TConfig>;
}): TParseResult => {
  const options = mergeWithDefaultConfig(_options);
  const { customProperties, foundBreakpoints } = parseInputCSS(code);

  const breakpoints = transformBreakpoints(foundBreakpoints, options);

  const classNameFormatter =
    typeof options.classNameFormat === 'function'
      ? options.classNameFormat
      : formatters[options.classNameFormat];

  const utilities = generateUtilities({
    rules: options.rules,
    customProperties,
    breakpoints,
    classNameFormatter,
  });

  return {
    classNames: utilities.map(({ selector }) => selector),
    generateTypeDefinitions() {
      return generateTypeDefinitions(utilities);
    },
    generateCSS(classNames: Array<string> = []) {
      return generateCSS(utilities, classNames, { cascadeLayer: options.cascadeLayer, minify: options.minifyOutput });
    },
  };
};
