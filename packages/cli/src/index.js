import { glob } from 'glob';
import path from 'node:path';
import {
  parseTokensToUtilities,
  extractClassNamesFromString,
} from '@stilvoll/core';

import { CONFIG_FILE_NAME } from './constants.js';

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
    args,
  );

  const context = {
    logger: createLogger(flags.verbose),
  };

  // If version flag
  if (flags.version) {
    const pkg = await loadPkg();
    context.logger.log(`${pkg.name} v${pkg.version}`);
    process.exit(0);
  }

  if (flags.dryRun) {
    context.logger.info('Dry Run, output will not be written to disk');
  }

  // Step 1: Look for and load config
  const config = await loadConfig(CONFIG_FILE_NAME, process.cwd(), context);
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
      `Parsed tokens to ${transformed.classNames.length} potential css classes`,
    );
    context.logger.debug(transformed.classNames.join(', '));

    const classesToGenerate = [];

    if (config.entries.length > 0 && !flags.watch) {
      markupFiles = await glob(config.entries);
      context.logger.debug('Parsing Markup');

      const markup = await loadFiles(markupFiles, process.cwd(), context);
      const found = extractClassNamesFromString({
        code: markup.toString(),
        classNames: transformed.classNames,
        objectTokensOnly: false,
      });

      if (found.length > 0) {
        classesToGenerate.push(
          ...found.map(({ classNames }) => classNames).flat(),
        );
      }
    }

    if (classesToGenerate.length > 0) {
      context.logger.debug(
        `Found ${classesToGenerate.length} class(es) to generate`,
      );
    } else {
      context.logger.debug('Generating all utility classes');
    }

    if (config.output) {
      if (!flags.dryRun) {
        await writeFile(
          config.output,
          process.cwd(),
          transformed.generateCSS(classesToGenerate, {
            hash: false,
            skipComment: false,
          }),
          context,
        );
      } else {
        context.logger.info(`Dry Run, nothing was written to ${config.output}`);
      }
    }

    if (config.typeDefinitions !== false) {
      if (!flags.dryRun) {
        await writeFile(
          path.relative(process.cwd(), config.typeDefinitions),
          process.cwd(),
          transformed.generateTypeDefinitions(),
          context,
        );
      } else {
        context.logger.info(
          `Dry Run, nothing was written to ${config.classNameMap}`,
        );
      }
    }

    if (!flags.dryRun) {
      let elapsed = performance.now() - start;
      context.logger.success(
        `Generated utility CSS in ${roundWithPrecision(elapsed, 4)}ms`,
      );
    }
  };

  await performWork();

  // Step 4: In watch mode set up watchers
  // to the input files and run the process
  // again if they change
  if (flags.watch) {
    context.logger.info(
      'Running in watch mode. Will re-compile on changes to your css',
    );
    watchFiles(config.input, process.cwd(), performWork, context);
  }
}
