import { SelectorList, TokenOrValue, transform } from 'lightningcss';
import type {
  TBreakpoint,
  TConfig,
  TCustomProperty,
  TParseResult,
} from '../types';

import { ensureBuffer } from './utils';
import { snakeCaseFormatter, tailwindFormatter } from './formatters';
import { mergeWithDefaultConfig } from './options';
import {
  generateUtilities,
  generateCSS,
  generateTypeDefinitions,
} from './generator';

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

const stringifyBreakpoint = (input: number | string) => {
  if (typeof input === 'number')
    return `@media screen and (min-width: ${input}px)`;

  return input;
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

        if (rule.type === 'unknown' && !hasBreakpointsDefined) {
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
          [key]: stringifyBreakpoint(value),
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

  const formatterLookup = {
    snakeCase: snakeCaseFormatter,
    tailwind: tailwindFormatter,
  };

  const classNameFormatter =
    typeof options.classNameFormat === 'function'
      ? options.classNameFormat
      : formatterLookup[options.classNameFormat];

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
      return generateCSS(utilities, classNames);
    },
  };
};
