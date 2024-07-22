import { transform } from 'lightningcss';

import {
  snakeCaseFromArray,
  hashClassName,
  omit,
  uniqueArray,
} from './utils.js';
import { defaultOptions } from './options.js';

/**
 * Checks if the current element is a CSS `:root`
 * element.
 */
const isRootElement = (_selectors) => {
  const selectors = (_selectors ?? []).flat();

  return (
    selectors.length === 1 &&
    selectors[0].type === 'pseudo-class' &&
    selectors[0].kind === 'root'
  );
};

/**
 * Extracts custom properties, turning them into
 * a unified shape.
 */
const extractCustomProperties = ({ property, value }) => {
  if (property !== 'custom') return null;

  return {
    key: value.name,
    value: `var(${value.name})`,
  };
};

/**
 * Checks if a value is a custom property
 */
const generateUtilities =
  (utilities) =>
    ({ key, value }) => {
      const res = Object.entries(utilities)
        .map(([utilKey, { customPropertyRegex, utilities }]) => {
          if (key.match(customPropertyRegex)) {
            return {
              key: `${utilKey}${key}`,
              category: utilKey,
              name: key.replace(customPropertyRegex, ''),
              utilities,
              value,
            };
          }
          return null;
        })
        .filter(Boolean);

      return res;
    };

const generateTypeDefinitions = (cssMap) => {
  const map = Object.keys(cssMap).map((className) => {
    const { explainer, properties, selector } = cssMap[className](className);

    const propertiesString = properties
      .map(([attribute, value]) => `${attribute}: ${value};`)
      .join('\n  ');

    return `/** ${explainer ?? ''
      }\n\n\`\`\`css\n${selector}\n{\n  ${propertiesString}\n}\n\`\`\`*/\n  ${className}: string;`;
  });

  return `type UtilityMap = {
  ${map.join('\n  ')}
}

declare const u: UtilityMap;
export { u };
`;
};

const generateCSS = (cssMap, _classNames = [], options) => {
  const classNames =
    _classNames.length === 0 ? Object.keys(cssMap) : uniqueArray(_classNames);

  const mediaQueries = new Map();

  const css = classNames
    .map((className) => {
      const { selector, properties, media } = cssMap[className](
        options.hash ? hashClassName(className) : className,
      );

      const propertiesString = properties
        .map(
          ([attribute, value]) =>
            `${attribute}: ${value}${options.useImportant ? ' !important' : ''
            };`,
        )
        .join('\n  ');

      if (media) {
        mediaQueries.set(media, [
          ...(mediaQueries.get(media) ?? []),
          `${selector}{\n${propertiesString}\n}`,
        ]);
        return null;
      } else {
        return `${selector}{\n${propertiesString}\n}`;
      }
    })
    .filter(Boolean)
    .join('\n');

  const mediaQueryCSS = [...mediaQueries.entries()]
    .map(([media, rules]) => {
      return `${media} {\n${rules.join('\n')}\n}`;
    })
    .join('\n');

  if (options.skipComment) return css;
  return `/* ${new Date().toISOString()} */\n${options.banner}\n\n${css}\n\n${mediaQueryCSS}`;
};

/**
 * Generates a map of all possible CSS classes the current
 * input CSS can generate.
 */
const generateCSSMap = ({ utilities, staticUtilities, breakpoints }) => {
  const breakpointKeys = [null, ...Object.keys(breakpoints)];

  const res = utilities.reduce((acc, { name, value, utilities }) => {
    for (const [classNameKey, generator] of Object.entries(utilities)) {
      for (const breakpoint of breakpointKeys) {
        const className = snakeCaseFromArray(
          [breakpoint, classNameKey, '_', name].filter(Boolean),
        );

        if (typeof generator === 'function') {
          acc = {
            ...acc,
            [className]: (className) => ({
              ...generator({ className, value }),
              media: breakpoints[breakpoint],
            }),
          };
        } else if (Array.isArray(generator)) {
          acc = {
            ...acc,
            [className]: (className) => ({
              selector: `.${className} `,
              properties: generator.map((p) => [p, value]),
              media: breakpoints[breakpoint],
            }),
          };
        } else if (typeof generator === 'object') {
          acc = {
            ...acc,
            [className]: (className) => ({
              selector: `.${className} `,
              properties: generator.properties.map((p) => [p, value]),
              explainer: generator.explainer,
              media: breakpoints[breakpoint],
            }),
          };
        }
      }
    }

    return acc;
  }, {});

  return Object.keys(staticUtilities).reduce((acc, key) => {
    const { properties, explainer } = staticUtilities[key];
    for (const breakpoint of breakpointKeys) {
      const className = snakeCaseFromArray([breakpoint, key].filter(Boolean));
      acc = {
        ...acc,
        [className]: (className) => ({
          selector: `.${className} `,
          properties: properties.map((p) => p),
          explainer,
          media: breakpoints[breakpoint],
        }),
      };
    }

    return acc;
  }, res);
};

const ensureBuffer = (input) => {
  if (typeof input === 'string') return Buffer.from(input);
  return input;
};

const parseCustomMedia = (prelude) => {
  const name = prelude.find((p) => p.type === 'dashed-ident').value?.slice(2);
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

const parseInputCSS = (code, options) => {
  const customProperties = [];
  const breakpoints = {};

  const hasBreakpointsDefined = Object.keys(options.breakpoints).length > 0;

  transform({
    code: ensureBuffer(code),
    visitor: {
      Rule({ value }) {
        const { selectors, declarations } = value;

        // Either we have breakpoints defined in the config
        // or we try to find them in the CSS
        if (value.name === 'custom-media' && !hasBreakpointsDefined) {
          const [name, mediaQuery] = parseCustomMedia(value.prelude);
          breakpoints[name] = mediaQuery;
        }

        if (isRootElement(selectors)) {
          customProperties.push(
            ...declarations.declarations
              .map(extractCustomProperties)
              .filter(Boolean)
              .flat(),
          );
        }
      },
    },
  });

  const tokens = [
    ...customProperties,
    ...Object.entries(options.additionalTokens).map(([key, value]) => ({
      key,
      value,
    })),
  ];

  const utilities = tokens.map(generateUtilities(options.utilities)).flat();

  return {
    utilities: Object.values(
      utilities.reduce((acc, cur) => {
        acc[cur.key] = omit(['key'], cur);
        return acc;
      }, {}),
    ),
    breakpoints: hasBreakpointsDefined
      ? Object.entries(options.breakpoints).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: `@media screen and (min-width: ${value}px)`,
        }),
        {},
      )
      : breakpoints,
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
} = {}) => {
  const options = Object.assign({}, defaultOptions, _options);
  const { utilities, breakpoints } = parseInputCSS(code, options);

  const cssMap = generateCSSMap({
    utilities,
    staticUtilities: options.staticUtilities,
    breakpoints,
  });

  return {
    classNames: Object.keys(cssMap),
    generateTypeDefinitions(hash = false) {
      return generateTypeDefinitions(cssMap, { ...options, hash });
    },
    generateCSS(classNames = [], hash = false, skipComment = false) {
      return generateCSS(cssMap, classNames, { ...options, hash, skipComment });
    },
  };
};
