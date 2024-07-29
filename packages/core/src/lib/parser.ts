import { SelectorList, TokenOrValue, transform } from 'lightningcss';
import type {
  TBreakpoint,
  TConfig,
  TCustomProperty,
  TParseResult,
  TRule,
  TRuleName,
  TRuleResult,
  TUtilityStyle,
  TFormatterProps,
} from '../types';

import { STILVOLL_OBJECT_NAME } from '../constants';
import { ensureBuffer, uniqueArray } from './utils';
import { escapeSelector } from './escape';
import { snakeCaseFormatter, tailwindFormatter } from './formatters';
import { mergeWithDefaultConfig } from './options';

const NOOP_BREAKPOINT = { name: null, media: null };

/**
 * Checks if the current element is a CSS `:root`
 * element.
 */
const isRootElement = (_selectors: SelectorList) => {
  const selectors = (_selectors ?? []).flat();

  return (
    selectors.length === 1 &&
    selectors[0]?.type === 'pseudo-class' &&
    selectors[0]?.kind === 'root'
  );
};

/**
 * Minifies a string of CSS
 */
export const minify = (input: string): string =>
  input.replace(/\s+/g, ' ').trim();

/**
 * Extracts custom properties, turning them into
 * a unified shape.
 */
const extractCustomProperties = ({
  property,
  value,
}): TCustomProperty | null => {
  if (property !== 'custom') return null;

  return {
    key: value.name,
    value: `var(${value.name})`,
  };
};

/**
 * Checks if a value is a custom property
 */
const generateUtilities = (
  rules: Array<TRule>,
  customProperties: Array<TCustomProperty>,
  breakpoints: Array<TBreakpoint>,
  classNameFormatter: (input: TFormatterProps) => string,
) => {
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

const generateCSS = (
  utilities: Array<TUtilityStyle>,
  _classNames: Array<string> = [],
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

  return minify(`/* AUTO-GENERATED, DO NOT EDIT */ ${styles}`);
};

const generateTypeDefinitions = (utilities: Array<TUtilityStyle>): string => {
  const properties = utilities.map(({ selector, media, css }) => {
    const commentCode = media ? `${media} {\n${css}\n}` : css;

    return `/**
\`\`\`css
${commentCode}
\`\`\`
*/
"${selector}": Property;`;
  });

  return `type Property = UtilityMap & string;

type UtilityMap = {
  ${properties.join('\n  ')}
}

declare const ${STILVOLL_OBJECT_NAME}: UtilityMap;
export { ${STILVOLL_OBJECT_NAME} }
`;
};

const parseCustomMedia = (
  prelude: Array<TokenOrValue>,
): [string, string] | null => {
  const identifier = prelude.find((p) => p.type && p.type === 'dashed-ident');
  const name = identifier?.value?.slice(2);

  if (!name) return null;

  const query = prelude
    .filter((p) => p.value !== name)
    .map((p) => {
      if (p.type === 'token') {
        switch (p.value.type) {
          case 'white-space': {
            return p.value.value;
          }
          case 'ident': {
            return p.value.value;
          }
          case 'parenthesis-block': {
            return '(';
          }
          case 'close-parenthesis': {
            return ')';
          }
          case 'colon': {
            return ':';
          }
          case 'semicolon': {
            return ';';
          }
        }
      }

      switch (p.type) {
        case 'length': {
          return `${p.value.value}${p.value.unit}`;
        }
      }

      return '';
    })
    .join('')
    .trim();

  return [name, `@media ${query}`];
};

const parseInputCSS = (
  code: string | Buffer,
  options: TConfig,
): {
  customProperties: TCustomProperty[];
  breakpoints: TBreakpoint[];
} => {
  const customProperties: Array<TCustomProperty> = [];
  const foundBreakpoints: Record<string, string> = {};

  const hasBreakpointsDefined = Object.keys(options.breakpoints).length > 0;

  transform({
    code: ensureBuffer(code),
    filename: 'stilvoll.css',
    visitor: {
      Rule(rule) {
        if (rule.type === 'style') {
          const value = rule.value;
          const { selectors, declarations } = value;
          if (isRootElement(selectors)) {
            const foundCustomProperties = declarations.declarations
              .map(extractCustomProperties)
              .filter((r) => r !== null)
              .flat();

            customProperties.push(...(foundCustomProperties ?? []));
          }
        }

        if (rule.type === 'unknown') {
          const value = rule.value;
          if (value.name === 'custom-media') {
            const resolvedCustomMedia = parseCustomMedia(value.prelude);

            if (resolvedCustomMedia !== null) {
              const [name, mediaQuery] = resolvedCustomMedia;
              foundBreakpoints[name] = mediaQuery;
            }
          }
        }
      },
    },
  });

  const breakpoints: Record<string, string> = hasBreakpointsDefined
    ? Object.entries(options.breakpoints).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: `@media screen and (min-width: ${value}px)`,
      }),
      {},
    )
    : foundBreakpoints;

  return {
    customProperties,
    breakpoints: Object.entries(breakpoints).map(([name, media]) => ({
      name,
      media,
    })),
  };
};

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
  const { customProperties, breakpoints } = parseInputCSS(code, options);

  // Not used now, but maybe useful in the future
  const formatterLookup = {
    snakeCase: snakeCaseFormatter,
    tailwind: tailwindFormatter,
  };

  const classNameFormatter =
    typeof options.classNameFormat === 'function'
      ? options.classNameFormat
      : formatterLookup[options.classNameFormat];

  const utilities = generateUtilities(
    options.rules,
    customProperties,
    breakpoints,
    classNameFormatter,
  );

  return {
    classNames: utilities.map(({ selector }) => selector),
    generateTypeDefinitions() {
      return generateTypeDefinitions(utilities);
    },
    generateCSS(classNames: Array<string> = []) {
      return generateCSS(utilities, classNames);
    },
  };
};
