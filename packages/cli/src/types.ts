import { TLogger } from './lib/logger';

export type TGlobalFlags = 'verbose' | 'version';
export type TContext = {
  logger: TLogger;
};
