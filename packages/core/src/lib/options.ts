import { z } from 'zod';

import type { TConfig } from '../types';
import { defaultFileSystemGlobs, defaultTypeDefinitionsPath } from '../defaults';

const configSchema = z
  .object({
    input: z.array(z.string()),
    entries: z.array(z.string()),
    output: z.string().nullable(),
    typeDefinitionsOutput: z.string().or(z.literal(false)),
    breakpoints: z.record(z.number()),
    rules: z.array(z.any()),
  })
  .passthrough();

export const defaultOptions: TConfig = {
  input: [],
  entries: defaultFileSystemGlobs,
  output: null,
  typeDefinitionsOutput: defaultTypeDefinitionsPath,
  breakpoints: {},
  classNameFormat: 'snakeCase',
  rules: [],
};

export const mergeWithDefaultConfig = (
  config: Partial<TConfig> = {},
): TConfig => ({
  ...defaultOptions,
  ...config,
  rules: [...defaultOptions.rules, ...(config.rules ?? [])],
});

export const validateConfig = (config: Partial<TConfig>) =>
  configSchema.parse(mergeWithDefaultConfig(config));
