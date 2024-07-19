import { transform } from 'lightningcss';

import { camelCaseFromArray, hashClassName, omit, uniqueArray } from './utils.js';
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

const createClassNameMap = (utilities, options) => {
  const map = utilities.reduce((acc, { name, utilities }) => {
    Object.keys(utilities).forEach((classNameKey) => {
      const className = camelCaseFromArray([classNameKey, name]);
      acc[className] = options.hash ? hashClassName(className) : className;
    });

    return acc;
  }, {});

  return `${options.banner}
/* UTILS_SKIP */

/**
 * @typedef {Object} UtilityMap
${Object.keys(map).map((key) => ` * @property {string} ${key}`).join('\n')}
 */

/**
 * @type {UtilityMap}
 */
export const u = new Proxy({}, {
  get: (_, prop) => {
    return prop;
  }
});`;
};

const createAllClassNames = (utilities) => {
  return utilities
    .map(({ name, utilities }) => {
      return Object.keys(utilities).map((classNameKey) => {
        return camelCaseFromArray([classNameKey, name]);
      });
    })
    .flat();
};

const generateCSS = (cssMap, _classNames = [], options) => {
  const classNames = _classNames.length === 0 ? Object.keys(cssMap) : uniqueArray(_classNames);

  const css = classNames
    .map((className) => {
      const { selector, properties } = cssMap[className](options.hash ? hashClassName(className) : className);
      const propertiesString = properties
        .map(
          ([attribute, value]) =>
            `${attribute}: ${value}${options.useImportant ? ' !important' : ''
            };`
        )
        .join('\n  ');

      return `${selector}{\n ${propertiesString}\n}`;
    }).join('\n');

  if (options.skipComment) return css;
  return `/* ${new Date().toISOString()} */\n${options.banner}\n\n${css}`;
};

const generateCSSMap = (utilities) => {
  const res = utilities.reduce((acc, { name, value, utilities }) => {
    for (const [classNameKey, properties] of Object.entries(utilities)) {
      const className = camelCaseFromArray([classNameKey, name]);

      if (Array.isArray(properties)) {
        acc = {
          ...acc,
          [className]: (className) => ({
            selector: `.${className} `,
            properties: properties.map((p) => [p, value]),
          })
        }
      }

      if (typeof properties === 'function') {
        acc = {
          ...acc,
          [className]: (className) => properties({ className, value }),
        };
      }
    }

    return acc;
  }, {});

  return res;
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
  const cssMap = generateCSSMap(utilities, options);

  return {
    classNames: createAllClassNames(utilities, options),
    generateClassNameMap(hash = false) {
      return createClassNameMap(utilities, { ...options, hash });
    },
    generateCSS(classNames = [], hash = false, skipComment = false) {
      return generateCSS(cssMap, classNames, { ...options, hash, skipComment });
    }
  };
};
