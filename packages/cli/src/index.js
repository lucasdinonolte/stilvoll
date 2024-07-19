import { glob } from 'glob';
import { parseTokensToUtilities, extractClassNamesFromString } from '@lucasdinonolte/token-utility-css-core';

import { parseCLIFlags } from './lib/flags.js';
import { loadConfig } from './lib/config.js';
import { loadPkg, loadFiles, watchFiles, writeFile } from './lib/files.js';
import { roundWithPrecision } from './lib/util.js';
import { createLogger } from './lib/logger.js';

export default async function main(args) {
  const flags = parseCLIFlags(
    {
      dryRun: ['--dry'],
      verbose: ['--verbose'],
      version: ['--version', '-v'],
      watch: ['--watch', '-w'],
    },
    args
  );

  const context = {
    logger: createLogger(flags.verbose),
  };

  // If version flag
  if (flags.version) {
    const pkg = await loadPkg();
    context.logger.log(pkg.version);
    process.exit(0);
  }

  if (flags.dryRun) {
    context.logger.info('Dry Run, output will not be written to disk');
  }

  // Step 1: Look for and load config
  const config = await loadConfig('util.config.js', process.cwd(), context);
  if (config === null) process.exit(1);

  let markupFiles = [];

  const performWork = async () => {
    // Step 2: Load the input file(s) into
    // a buffer
    const code = await loadFiles(config.input, process.cwd(), context);

    // Step 3: Run the parser and transformer
    context.logger.debug('Parsing CSS input');
    let start = performance.now();

    const transformed = parseTokensToUtilities({
      code,
      options: config,
    });

    context.logger.debug(
      `Parsed tokens to ${transformed.classNames.length} potential css classes`
    );
    context.logger.debug(transformed.classNames.join(', '));

    const classesToGenerate = [];

    if (config.entries.length > 0 && !flags.watch) {
      markupFiles = await glob(config.entries);
      context.logger.debug('Parsing Markup');

      const markup = await loadFiles(markupFiles, process.cwd(), context);
      const classNames = extractClassNamesFromString(
        markup.toString(),
        transformed.classNames
      );
      classesToGenerate.push(...classNames);
    }

    if (classesToGenerate.length > 0) {
      context.logger.debug(`Found ${classesToGenerate.length} class(es) to generate`);
    } else {
      context.logger.debug('Generating all utility classes');
    }

    if (config.output) {
      if (!flags.dryRun) {
        await writeFile(
          config.output,
          process.cwd(),
          transformed.generateCSS(classesToGenerate),
          context
        );
      } else {
        context.logger.info(`Dry Run, nothing was written to ${config.output}`);
      }
    }

    if (config.classNameMap) {
      if (!flags.dryRun) {
        await writeFile(
          config.classNameMap,
          process.cwd(),
          transformed.generateClassNameMap(),
          context
        );
      } else {
        context.logger.info(
          `Dry Run, nothing was written to ${config.classNameMap}`
        );
      }
    }

    if (!flags.dryRun) {
      let elapsed = performance.now() - start;
      context.logger.success(
        `Generated utility CSS in ${roundWithPrecision(elapsed, 4)}ms`
      );
    }
  };

  await performWork();

  // Step 4: In watch mode set up watchers
  // to the input files and run the process
  // again if they change
  if (flags.watch) {
    watchFiles(config.input,
      process.cwd(), performWork, context);
  }
}
