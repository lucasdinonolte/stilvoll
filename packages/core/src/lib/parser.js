import { transform } from 'lightningcss';

import { hashClassName, kebabCaseFromArray, omit } from './utils.js';
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
      const className = kebabCaseFromArray([classNameKey, name]);
      acc[className] = hashClassName(className);
    });

    return acc;
  }, {});

  return `${options.banner}\n\nexport const u = ${JSON.stringify(
    map,
    null,
    2
  )};`;
};

const createAllClassNames = (utilities) => {
  return utilities
    .map(({ name, utilities }) => {
      return Object.keys(utilities).map((classNameKey) => {
        return kebabCaseFromArray([classNameKey, name]);
      });
    })
    .flat();
};

const generateCSSFromUtilities = (utilities, options) => {
  const css = utilities
    .map(({ name, value, utilities }) => {
      return Object.entries(utilities).map(([classNameKey, properties]) => {
        const className = hashClassName(
          kebabCaseFromArray([classNameKey, name])
        );

        if (Array.isArray(properties)) {
          return {
            selector: `.${className}`,
            properties: properties.map((p) => [p, value]),
          };
        }

        if (typeof properties === 'function') {
          return properties({ className, value });
        }
      });
    })
    .flat()
    .map(({ selector, properties }) => {
      const propertiesString = properties
        .map(
          ([attribute, value]) =>
            `${attribute}: ${value}${options.useImportant ? ' !important' : ''
            };`
        )
        .join('\n  ');

      return `${selector} {
  ${propertiesString}
}`;
    })
    .join('\n');

  return `${options.banner}\n\n${css}`;
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

  return {
    classNames: createAllClassNames(utilities, options),
    getClassNameMap() {
      return createClassNameMap(utilities, options);
    },
    getCSS() {
      return generateCSSFromUtilities(utilities, options);
    },
  };
};
