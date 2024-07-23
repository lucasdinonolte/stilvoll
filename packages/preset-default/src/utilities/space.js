/**
 * Utilities for controlling spacing.
 */
export const space = () => ({
  utilities: {
    margin: {
      customPropertyRegex: /^--space-/,
      utilities: {
        m: {
          properties: ['margin'],
          explainer: 'Sets margin on all directions',
        },
        p: {
          properties: ['padding'],
          explainer: 'Sets padding on all directions',
        },
        mx: {
          properties: ['margin-left', 'margin-right'],
          explainer: 'Sets margin left and right',
        },
        my: {
          properties: ['margin-top', 'margin-bottom'],
          explainer: 'Sets margin top and bottom',
        },
      },
      additionalValues: {
        auto: 'auto',
        none: 0,
        px: '1px',
      },
    },
    padding: {
      customPropertyRegex: /^--space-/,
      utilities: {
        px: {
          properties: ['padding-left', 'padding-right'],
          explainer: 'Sets padding left and right',
        },
        py: {
          properties: ['padding-top', 'padding-bottom'],
          explainer: 'Sets padding top and bottom',
        },
        mt: { properties: ['margin-top'], explainer: 'Sets margin top' },
        mr: { properties: ['margin-right'], explainer: 'Sets margin right' },
        mb: { properties: ['margin-bottom'], explainer: 'set margin bottom' },
        ml: { properties: ['margin-left'], explainer: 'Sets margin left' },
        pt: { properties: ['padding-top'], explainer: 'Sets padding top' },
        pr: { properties: ['padding-right'], explainer: 'Sets padding right' },
        pb: {
          properties: ['padding-bottom'],
          explainer: 'Sets padding bottom',
        },
        pl: { properties: ['padding-left'], explainer: 'Sets padding left' },
      },
      additionalValues: {
        none: 0,
        px: '1px',
      },
    },
    gap: {
      customPropertyRegex: /^--space-/,
      utilities: {
        gap: {
          properties: ['gap'],
          explainer: 'Sets gap between elements in flex and grid containers',
        },
        'gap-x': {
          properties: ['column-gap'],
        },
        'gap-y': {
          properties: ['row-gap'],
        },
      },
      additionalValues: {
        none: 0,
        px: '1px',
      },
    },
    stack: {
      customPropertyRegex: /^--space-/,
      utilities: {
        'stack-y': ({ className, value }) => ({
          css: `.${className} > :not([hidden]) ~ :not([hidden]) {
  margin-top: ${value};
}`,
        }),
        'stack-x': ({ className, value }) => ({
          css: `.${className} > :not([hidden]) ~ :not([hidden]) {
  margin-left: ${value};
}`,
        }),
      },
    },
  },
});
