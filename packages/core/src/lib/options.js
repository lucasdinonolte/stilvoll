import { z } from 'zod';

const configSchema = z
  .object({
    input: z.array(z.string()),
    output: z.string(),
    entries: z.array(z.string()),
    classNameMap: z.string().nullable(),
    useImportant: z.boolean(),
    banner: z.string().nullable(),
  })
  .passthrough();

export const defaultOptions = {
  input: [],
  entries: [],
  output: null,
  classNameMap: null,
  useImportant: false,
  banner: '/* AUTOGENERATED, DO NOT EDIT DIRECTLY */',
  utilities: {
    space: {
      customPropertyRegex: /^--space-/,
      utilities: {
        m: { properties: ['margin'], explainer: 'Sets margin on all directions' },
        p: { properties: ['padding'], explainer: 'Sets padding on all directions' },
        mx: { properties: ['margin-left', 'margin-right'], explainer: 'Sets margin left and right' },
        my: { properties: ['margin-top', 'margin-bottom'], explainer: 'Sets margin top and bottom', },
        px: { properties: ['padding-left', 'padding-right'], explainer: 'Sets padding left and right' },
        py: { properties: ['padding-top', 'padding-bottom'], explainer: 'Sets padding top and bottom' },
        mt: { properties: ['margin-top'], explainer: 'Sets margin top' },
        mr: { properties: ['margin-right'], explainer: 'Sets margin right' },
        mb: { properties: ['margin-bottom'], explainer: 'set margin bottom' },
        ml: { properties: ['margin-left'], explainer: 'Sets margin left' },
        pt: { properties: ['padding-top'], explainer: 'Sets padding top' },
        pr: { properties: ['padding-right'], explainer: 'Sets padding right' },
        pb: { properties: ['padding-bottom'], explainer: 'Sets padding bottom' },
        pl: { properties: ['padding-left'], explainer: 'Sets padding left' },
        gap: { properties: ['gap'], explainer: 'Sets gap between elements in flex and grid containers' },
        stack: ({ className, value }) => ({
          selector: `.${className} > :not([hidden]) ~ :not([hidden])`,
          properties: [['margin-top', value]],
          explainer: 'A stack puts space between elements in a stack.',
        }),
      },
    },
    color: {
      customPropertyRegex: /^--color-/,
      utilities: {
        color: { properties: ['color'], explainer: 'Sets text color' },
        background: { properties: ['background-color'], explainer: 'Sets background color' },
      },
    },
  },
};

const mergeWithDefaultConfig = (config = {}) =>
  Object.assign({}, defaultOptions, config);

export const validateConfig = (config) =>
  configSchema.parse(mergeWithDefaultConfig(config));
