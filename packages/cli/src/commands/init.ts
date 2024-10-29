import { parseCLIFlags } from '../lib/cli';
import { TContext } from '../types';
import { fileExists, writeFile } from '../lib/files';

type TInitFlags = 'force';

const TEMPLATE = `import { createConfig } from '@stilvoll/core';

// For all config options see:
// https://stilvoll.netlify.app/guides/config-file/

export default createConfig({
  // Input tells Stilvoll where to look for your custom
  // properties and custom media breakpoints
  input: ['./src/index.css'],

  // Array of rules to generate utility rules
  rules: [],

  // Where to output the utility CSS
  // (only used by the CLI, as postcss and vite plugin will just
  // inject into the tool's CSS bundle)
  output: './dist/utils.css',

  // Define the format of the utility classnames. Built in options
  // are \`snakeCase\` (default setting, generating \`md_col_12\`) and
  // \`tailwind\` (generating \`md:col-12\`). You can also pass a function
  // to roll your own class name formatting.
  //
  // Keep in mind that \`snakeCase\` is the recommended setting when
  // yout want to work with the typesafe sv import, as snake case
  // object keys don't need to be quoted in JavaScript.
  classNameFormat: 'snakeCase',
});`;

export default async function initCommand(
  args: Array<string>,
  context: TContext,
) {
  const flags = parseCLIFlags<TInitFlags>(
    {
      force: ['--force', '-f'],
    },
    args,
  );

  if (flags.force) {
    context.logger.info(
      'Running in force mode will overwrite any potentially already existing config files',
    );
  }

  const outputFile = 'stilvoll.config.js';
  const outputExists = await fileExists(outputFile, process.cwd());

  if (!flags.force && outputExists) {
    context.logger.info('Config file already exists, use --force to overwrite');
    process.exit(0);
  }

  await writeFile(outputFile, process.cwd(), TEMPLATE, context);
  context.logger.success('Config file created');
}
