import { transform } from 'lightningcss';

import {
  camelCaseFromArray,
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
 * Checks if a value is a custom property
 */
const isCustomProperty =
  (utilities) =>
    ({ property, value }) => {
      if (property !== 'custom') return null;

      const res = Object.entries(utilities)
        .map(([key, { customPropertyRegex, utilities }]) => {
          if (value?.name?.match(customPropertyRegex)) {
            return {
              key: `${key}${value.name}`,
              category: key,
              name: value.name.replace(customPropertyRegex, ''),
              utilities,
              value: `var(${value.name})`,
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

  const css = classNames
    .map((className) => {
      const { selector, properties } = cssMap[className](
        options.hash ? hashClassName(className) : className
      );
      const propertiesString = properties
        .map(
          ([attribute, value]) =>
            `${attribute}: ${value}${options.useImportant ? ' !important' : ''
            };`
        )
        .join('\n  ');

      return `${selector}{\n ${propertiesString}\n}`;
    })
    .join('\n');

  if (options.skipComment) return css;
  return `/* ${new Date().toISOString()} */\n${options.banner}\n\n${css}`;
};

const generateCSSMap = (utilities, staticUtilities) => {
  const res = utilities.reduce((acc, { name, value, utilities }) => {
    for (const [classNameKey, generator] of Object.entries(utilities)) {
      const className = camelCaseFromArray([classNameKey, '_', name]);

      if (typeof generator === 'function') {
        acc = {
          ...acc,
          [className]: (className) => generator({ className, value }),
        };
      } else if (Array.isArray(generator)) {
        acc = {
          ...acc,
          [className]: (className) => ({
            selector: `.${className} `,
            properties: generator.map((p) => [p, value]),
          }),
        };
      } else if (typeof generator === 'object') {
        acc = {
          ...acc,
          [className]: (className) => ({
            selector: `.${className} `,
            properties: generator.properties.map((p) => [p, value]),
            explainer: generator.explainer,
          }),
        };
      }
    }

    return acc;
  }, {});

  return Object.keys(staticUtilities).reduce((acc, key) => {
    const { properties, explainer } = staticUtilities[key];
    const className = camelCaseFromArray([key]);
    acc = {
      ...acc,
      [className]: (className) => ({
        selector: `.${className} `,
        properties: properties.map((p) => p),
        explainer,
      }),
    };

    return acc;
  }, res);
};

const ensureBuffer = (input) => {
  if (typeof input === 'string') return Buffer.from(input);
  return input;
};

const getUtilitiesFromTokens = (code, options) => {
  const res = [];

  transform({
    code: ensureBuffer(code),
    visitor: {
      Rule({ value }) {
        const { selectors, declarations } = value;

        if (isRootElement(selectors)) {
          res.push(
            ...declarations.declarations
              .map(isCustomProperty(options.utilities))
              .filter(Boolean)
              .flat()
          );
        }
      },
    },
  });

  return Object.values(
    res.reduce((acc, cur) => {
      acc[cur.key] = omit(['key'], cur);
      return acc;
    }, {})
  );
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
  const utilities = getUtilitiesFromTokens(code, options);

  const cssMap = generateCSSMap(utilities, options.staticUtilities);

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
