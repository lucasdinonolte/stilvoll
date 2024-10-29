import { getCLICommand, parseCLIFlags } from './lib/cli';
import { loadPkg } from './lib/files';
import { createLogger } from './lib/logger';
import { TGlobalFlags } from './types';

import buildCommand from './commands/build';
import initCommand from './commands/init';

export default async function main(args: Array<string>) {
  const globalFlags = parseCLIFlags<TGlobalFlags>(
    {
      verbose: ['--verbose'],
      version: ['--version', '-v'],
    },
    args,
  );

  const context = {
    logger: createLogger(globalFlags.verbose),
  };

  // If version flag
  if (globalFlags.version) {
    const pkg = await loadPkg();
    context.logger.log(`${pkg.name} v${pkg.version}`);
    process.exit(0);
  }

  getCLICommand<'build' | 'init'>(
    {
      build: buildCommand,
      init: initCommand,
    },
    { defaultCommand: 'build' },
  )({ args, context });
}
