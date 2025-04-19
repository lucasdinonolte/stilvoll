import { SelectorList, TokenOrValue, transform } from 'lightningcss';
import type { TBreakpoint, TConfig, TCustomProperty } from '../types';

import { ensureBuffer } from './utils';

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
            return ') ';
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

/**
 * Takes in CSS an parses it into a list of custom
 * properties and found breakpoints.
 */
export const parseInputCSS = (
  code: string | Buffer,
): {
  customProperties: TCustomProperty[];
  foundBreakpoints: Record<string, string>;
} => {
  const customProperties: Array<TCustomProperty> = [];
  const foundBreakpoints: Record<string, string> = {};

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

  return {
    customProperties,
    foundBreakpoints,
  };
};

/**
 * Tranforms breakpoints (found or user supplied ones) from
 * their original object shape into the array with added
 * metadata that the utility generator expects.
 */
export const transformBreakpoints = (
  foundBreakpoints: Record<string, string>,
  options: TConfig,
): TBreakpoint[] => {
  const hasBreakpointsDefined = Object.keys(options.breakpoints).length > 0;

  return Object.entries(
    hasBreakpointsDefined ? options.breakpoints : foundBreakpoints,
  ).map(([name, value]) => ({
    name,
    media: stringifyBreakpoint(value),
  }));
};
