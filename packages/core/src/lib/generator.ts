import type {
  TBreakpoint,
  TCustomProperty,
  TRule,
  TRuleName,
  TRuleResult,
  TUtilityStyle,
  TFormatterProps,
} from '../types';

import { STILVOLL_OBJECT_NAME } from '../constants';
import { minify, uniqueArray } from './utils';
import { escapeSelector } from './escape';

const NOOP_BREAKPOINT = { name: null, media: null };

export const generateUtilities = ({
  rules,
  customProperties,
  breakpoints,
  classNameFormatter,
}: {
  rules: Array<TRule>;
  customProperties: Array<TCustomProperty>;
  breakpoints: Array<TBreakpoint>;
  classNameFormatter: (input: TFormatterProps) => string;
}) => {
  const res: Array<TUtilityStyle> = [];

  const resolveName = (
    name: TRuleName,
    value: string,
    breakpoint: string | null,
  ): string => {
    if (typeof name === 'string')
      return classNameFormatter({ breakpoint, className: name });
    if (typeof name === 'function' && value)
      return classNameFormatter({ breakpoint, className: name(value) });

    throw new Error(
      `A function to generate a classname can only be used if the utility is set up to use multiple values.`,
    );
  };

  const stylesFromObject = (
    obj: Record<string, string | number>,
    name: string,
  ): string => {
    return `.${escapeSelector(name)} {\n  ${Object.entries(obj)
      .map(([k, v]) => `${k}: ${v};`)
      .join('\n  ')}\n}`;
  };

  const resolveStyles = (
    input: TRuleResult,
    name: string,
    value: string | number | null,
  ): string | null => {
    if (typeof input === 'object') {
      return stylesFromObject(input, name);
    }

    if (typeof input === 'function') {
      const styleResult = input(value, escapeSelector(name));

      if (typeof styleResult === 'string') return styleResult;
      if (typeof styleResult === 'object')
        return stylesFromObject(styleResult, name);
    }

    return null;
  };

  for (const [name, result, options] of rules) {
    const values = options?.values ?? {};
    const resolvedValues = Object.entries(values).reduce(
      (acc, [key, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
          acc[key] = value;
        }

        if (value instanceof RegExp) {
          for (const customProperty of customProperties) {
            if (customProperty.key.match(value)) {
              acc[customProperty.key.replace(value, '')] = customProperty.value;
            }
          }
        }

        return acc;
      },
      {},
    );

    const hasResolvedValues = Object.keys(resolvedValues).length > 0;

    if (typeof name === 'string' && hasResolvedValues) {
      throw new Error(
        `${name} is defined as a static utility, but set up to use values. Please use a function instead of a string to generate the classname in this case`,
      );
    }

    Object.entries(hasResolvedValues ? resolvedValues : { a: null }).forEach(
      ([key, value]) => {
        const breakpointsToUse =
          options?.responsive === false
            ? [NOOP_BREAKPOINT]
            : [NOOP_BREAKPOINT, ...breakpoints];

        for (const breakpoint of breakpointsToUse) {
          const resolvedName = resolveName(name, key, breakpoint.name);
          const resolvedStyles = resolveStyles(result, resolvedName, value);

          if (resolvedStyles) {
            res.push({
              selector: resolvedName,
              css: resolvedStyles,
              media: breakpoint.media,
            });
          }
        }
      },
    );
  }

  return res;
};

const maybeWrapInCascadeLayer = (
  code: string,
  casecadeLayer: string | false,
) => {
  if (!casecadeLayer) return code;
  return `@layer ${casecadeLayer} {\n${code}\n}`;
};

export const generateCSS = (
  utilities: Array<TUtilityStyle>,
  _classNames: Array<string> = [],
  cascadeLayer: string | false,
) => {
  const classNames =
    _classNames.length === 0
      ? utilities.map(({ selector }) => selector)
      : uniqueArray(_classNames);

  const defaultStyles: Array<string> = [];
  const mediaQueries = new Map<string, Array<string>>();

  utilities
    .filter(({ selector }) => classNames.includes(selector))
    .forEach(({ css, media }) => {
      if (media === null) defaultStyles.push(css);
      if (media !== null)
        mediaQueries.set(media, [...(mediaQueries.get(media) ?? []), css]);
    });

  const mediaStyles = [...mediaQueries.entries()].map(([media, rules]) => {
    return `${media} {\n${rules.join('\n')}\n}`;
  });

  const styles = [...defaultStyles, ...mediaStyles].join(' ');

  return minify(
    `/* AUTO-GENERATED, DO NOT EDIT */ ${maybeWrapInCascadeLayer(
      styles,
      cascadeLayer,
    )}`,
  );
};

export const generateTypeDefinitions = (
  utilities: Array<TUtilityStyle>,
): string => {
  const properties = utilities.map(({ selector, media, css }) => {
    const commentCode = media ? `${media} {\n${css}\n}` : css;

    return `/**
\`\`\`css
${commentCode}
\`\`\`
*/
"${selector}": Property;`;
  });

  return `type Property = string;

type UtilityMap = {
  ${properties.join('\n  ')}
}

declare const ${STILVOLL_OBJECT_NAME}: UtilityMap;
export { ${STILVOLL_OBJECT_NAME} }
`;
};
