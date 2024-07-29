import { z } from 'zod';
import { loadConfig } from 'unconfig';

import type { TConfig, TUserConfig } from '../types';
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

export const loadUserConfig = async (inlineConfig: Partial<TUserConfig> = {}, cwd: string = process.cwd()): Promise<TConfig> => {
  const { config } = await loadConfig<Partial<TUserConfig>>({
    cwd,
    sources: [
      {
        files: 'stilvoll.config',
        extensions: ['js', 'cjs', 'mjs'],
      }
    ],
    defaults: inlineConfig,
  });

  return mergeWithDefaultConfig(config);
}
