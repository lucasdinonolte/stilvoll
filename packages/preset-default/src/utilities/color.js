/**
 * Utilities for controlling text and background colors.
 */
export const color = () => ({
  utilities: {
    color: {
      customPropertyRegex: /^--color-/,
      utilities: {
        c: {
          properties: ['color'],
          explainer: 'Sets text color',
        },
      },
      additionalValues: {
        transparent: 'transparent',
        current: 'currentColor',
      },
    },
    background: {
      customPropertyRegex: /^--color-/,
      utilities: {
        bg: {
          properties: ['background-color'],
          explainer: 'Sets background color',
        },
      },
      additionalValues: {
        transparent: 'transparent',
      },
    },
  },
});
