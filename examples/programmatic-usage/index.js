import { generateUtilities, generateCSS } from '@stilvoll/core';
import { createFluid } from '@stilvoll/fluid-scale';

const { fluid } = createFluid({
  minViewport: '320px',
  maxViewport: '1280px',
  baseFontSize: '16px',
});

const SPACES = {
  auto: 'auto',
  none: 0,
  px: '1px',
  xs: fluid('2px', '8px'),
};

const main = () => {
  const utilities = generateUtilities({
    rules: [
      ['hidden', { display: 'none' }],
      [
        (name) => `m-${name}`,
        (value) => ({ margin: value }),
        { values: SPACES },
      ],
      [
        (name) => `mx-${name}`,
        (value) => ({
          'margin-right': value,
          'margin-left': value,
        }),
        { values: SPACES },
      ],
      [
        (name) => `my-${name}`,
        (value) => ({
          'margin-top': value,
          'margin-bottom': value,
        }),
        { values: SPACES },
      ],
      [
        (name) => `mt-${name}`,
        (value) => ({ 'margin-top': value }),
        { values: SPACES },
      ],
      [
        (name) => `mr-${name}`,
        (value) => ({ 'margin-right': value }),
        { values: SPACES },
      ],
      [
        (name) => `mb-${name}`,
        (value) => ({ 'margin-bottom': value }),
        { values: SPACES },
      ],
      [
        (name) => `ml-${name}`,
        (value) => ({ 'margin-left': value }),
        { values: SPACES },
      ],
      [
        (name) => `p-${name}`,
        (value) => ({ padding: value }),
        { values: SPACES },
      ],
      [
        (name) => `px-${name}`,
        (value) => ({
          'padding-right': value,
          'padding-left': value,
        }),
        { values: SPACES },
      ],
      [
        (name) => `py-${name}`,
        (value) => ({
          'padding-top': value,
          'padding-bottom': value,
        }),
        { values: SPACES },
      ],
      [
        (name) => `pt-${name}`,
        (value) => ({ 'padding-top': value }),
        { values: SPACES },
      ],
      [
        (name) => `pr-${name}`,
        (value) => ({ 'padding-right': value }),
        { values: SPACES },
      ],
      [
        (name) => `pb-${name}`,
        (value) => ({ 'padding-bottom': value }),
        { values: SPACES },
      ],
      [
        (name) => `pl-${name}`,
        (value) => ({ 'padding-left': value }),
        { values: SPACES },
      ],
      [
        (name) => `stack-${name}`,
        (value, selector) => `.${selector} > * + * {
  margin-top: ${value};
}`,
        { values: SPACES },
      ],
    ],
    breakpoints: [
      {
        name: 'md',
        media: '@media screen and (min-width: 768px)',
      },
    ],
  });

  const css = generateCSS(utilities);

  console.log(css);
};

main();
