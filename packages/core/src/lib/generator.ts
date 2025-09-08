import type {
  TBreakpoint,
  TCustomProperty,
  TRule,
  TRuleName,
  TRuleNameFunction,
  TRuleResult,
  TRuleResultFunction,
  TUtilityStyle,
  TFormatterProps,
} from '../types';

import { STILVOLL_OBJECT_NAME } from '../constants';
import { minify as minifyCss, indent, uniqueArray } from './utils';
import { escapeSelector } from './escape';
import { formatters } from './formatters';

const NOOP_BREAKPOINT = { name: null, media: null };

export const generateUtilities = ({
  rules,
  customProperties = [],
  breakpoints = [],
  classNameFormatter = formatters.tailwind,
}: {
  rules: Array<TRule>;
  customProperties?: Array<TCustomProperty>;
  breakpoints?: Array<TBreakpoint>;
  classNameFormatter?: (input: TFormatterProps) => string;
}) => {
  const res: Array<TUtilityStyle> = [];

  const resolveName = (
    name: TRuleName | TRuleNameFunction,
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
    input: TRuleResult | TRuleResultFunction,
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
    const isStaticRule = typeof name === 'string';

    const values =
      options instanceof RegExp
        ? [options]
        : Array.isArray(options)
          ? options
          : (options?.values ?? []);

    const resolvedValues = values.reduce((acc, value) => {
      if (Array.isArray(value)) {
        const [key, itemValue] = value;
        acc[key] = itemValue;
      }

      if (value instanceof RegExp) {
        for (const customProperty of customProperties) {
          if (customProperty.key.match(value)) {
            acc[customProperty.key.replace(value, '')] = customProperty.value;
          }
        }
      }

      return acc;
    }, {});

    const hasResolvedValues = Object.keys(resolvedValues).length > 0;

    if (isStaticRule && hasResolvedValues) {
      throw new Error(
        `${name} is defined as a static utility, but set up to use values. Please use a function instead of a string to generate the classname in this case`,
      );
    }

    const responsive =
      options instanceof RegExp
        ? true
        : Array.isArray(options)
          ? true
          : (options?.responsive ?? true);

    for (const [key, value] of Object.entries(hasResolvedValues ? resolvedValues : { a: null })) {
        const breakpointsToUse = responsive
          ? [NOOP_BREAKPOINT, ...breakpoints]
          : [NOOP_BREAKPOINT];

        if (!isStaticRule && value === null) continue;

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
      }
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

const maybeMinify = (code: string, minify: boolean) => {
  if (!minify) return code;
  return minifyCss(code);
};

export const generateCSS = (
  utilities: Array<TUtilityStyle>,
  _classNames: Array<string> = [],
  {
    banner,
    cascadeLayer = false,
    minify = true,
  }: {
    banner?: string;
    cascadeLayer?: string | false;
    minify?: boolean;
  } = {},
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
    return `${media} {\n${indent(rules.join('\n\n'))}\n}`;
  });

  const styles = [...defaultStyles, ...mediaStyles].join('\n\n');

  return maybeMinify(
    `${banner ? `${banner}\n\n` : ''}${maybeWrapInCascadeLayer(styles, cascadeLayer)}`,
    minify,
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
