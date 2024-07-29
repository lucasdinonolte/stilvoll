import type { TUserConfig } from '@stilvoll/core';

export type TStilvollPostCSSConfig = Omit<
  TUserConfig,
  'output' | 'typeDefinitionsOutput'
>;
