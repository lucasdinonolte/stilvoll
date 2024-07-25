import { transform } from 'lightningcss';

import { STILVOLL_OBJECT_NAME } from '../constants.js';

import {
  kebabCaseFromArray,
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
 * Minifies a string of CSS
 */
export const minify = (input) => input.replace(/\s+/g, ' ').trim();

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
const generateUtilities = (utils, customProperties) => {
  return Object.entries(utils)
    .map(
      ([
        utilKey,
        { customPropertyRegex, utilities, additionalValues = {} },
      ]) => {
        const res = [];

        if (customPropertyRegex) {
          customProperties.forEach(({ key, value }) => {
            if (key.match(customPropertyRegex)) {
              res.push({
                key: `${utilKey}${key}`,
                category: utilKey,
                name: key.replace(customPropertyRegex, ''),
                utilities,
                value,
              });
            }
          });

          Object.entries(additionalValues).forEach(([key, value]) => {
            res.push({
              key: `${utilKey}${key}`,
              category: utilKey,
              name: key.replace(customPropertyRegex, ''),
              utilities,
              value,
            });
          });
        } else {
          // This is a "static" utility
          res.push({
            key: utilKey,
            category: utilKey,
            name: '',
            utilities,
          });
        }

        return res;
      },
    )
    .flat();
};

const generateTypeDefinitions = (cssMap) => {
  const map = Object.keys(cssMap).map((className) => {
    const { explainer, properties, selector, css, media } =
      cssMap[className](className);

    const propertiesString =
      css ??
      properties
        .map(([attribute, value]) => `${attribute}: ${value};`)
        .join('\n  ');

    const codeComment = explainer ? `${explainer}\n` : '';
    const codeSample = selector
      ? `${selector}{\n  ${propertiesString}\n}`
      : propertiesString;
    const responsiveCodeSample = media
      ? `${media} {\n${codeSample}\n}`
      : codeSample;

    return `/** ${codeComment}\n\`\`\`css\n${responsiveCodeSample}\n\`\`\`*/\n  "${className}": Property;`;
  });

  return `type Property = UtilityMap & string;

type UtilityMap = {
  ${map.join('\n  ')}
}

declare const ${STILVOLL_OBJECT_NAME}: UtilityMap;
export { ${STILVOLL_OBJECT_NAME} }
`;
};

const generateCSS = (cssMap, _classNames = [], options) => {
  const classNames =
    _classNames.length === 0 ? Object.keys(cssMap) : uniqueArray(_classNames);

  const mediaQueries = new Map();

  const css = classNames
    .map((className) => {
      const { selector, properties, media, css } = cssMap[className](
        options.hash ? hashClassName(className) : className,
      );

      let code;
      if (css) {
        code = css;
      } else {
        const propertiesString = properties
          .map(
            ([attribute, value]) =>
              `${attribute}: ${value}${options.useImportant ? ' !important' : ''
              };`,
          )
          .join('\n  ');

        code = `${selector}{\n  ${propertiesString}\n}`;
      }

      if (media) {
        mediaQueries.set(media, [...(mediaQueries.get(media) ?? []), code]);
        return null;
      } else {
        return code;
      }
    })
    .filter(Boolean)
    .join('\n');

  const mediaQueryCSS = [...mediaQueries.entries()]
    .map(([media, rules]) => {
      return `${media} {\n${rules.join('\n')}\n}`;
    })
    .join('\n');

  if (options.skipComment) return minify(`${css} ${mediaQueryCSS}`);
  return minify(
    `/* ${new Date().toISOString()} */\n${options.banner}\n\n${css}\n\n${mediaQueryCSS}`,
  );
};

/**
 * Generates a map of all possible CSS classes the current
 * input CSS can generate.
 */
const generateCSSMap = ({ utilities, breakpoints, classNameFormatter }) => {
  const breakpointKeys = [null, ...Object.keys(breakpoints)];

  return utilities.reduce((acc, { name, value, utilities }) => {
    for (const [classNameKey, generator] of Object.entries(utilities)) {
      for (const breakpoint of breakpointKeys) {
        const className = classNameFormatter(
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
              properties: generator.map((p) => {
                return value != null ? [p, value] : [p[0], p[1]];
              }),
              media: breakpoints[breakpoint],
            }),
          };
        } else if (typeof generator === 'object') {
          acc = {
            ...acc,
            [className]: (className) => ({
              selector: `.${className} `,
              properties: generator.properties.map((p) => {
                return value != null ? [p, value] : [p[0], p[1]];
              }),
              explainer: generator.explainer,
              media: breakpoints[breakpoint],
            }),
          };
        }
      }
    }

    return acc;
  }, {});
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

  const utilities = generateUtilities(options.utilities, customProperties);

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

  // Not used now, but maybe useful in the future
  const classNameFormatter = snakeCaseFromArray;

  const cssMap = generateCSSMap({
    utilities,
    breakpoints,
    classNameFormatter,
  });

  return {
    classNames: Object.keys(cssMap),
    generateTypeDefinitions({ hash = false } = {}) {
      return generateTypeDefinitions(cssMap, { ...options, hash });
    },
    generateCSS(classNames = [], { hash = false, skipComment = false } = {}) {
      return generateCSS(cssMap, classNames, { ...options, hash, skipComment });
    },
  };
};
