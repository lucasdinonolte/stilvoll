import fg from 'fast-glob';
import path from 'node:path';
import { debounce } from 'perfect-debounce';

import {
  loadUserConfig,
  parseTokensToUtilities,
  extractClassNamesFromString,
} from '@stilvoll/core';

import { parseCLIFlags } from '../lib/cli';
import { loadFiles, writeFile } from '../lib/files';
import { roundWithPrecision } from '../lib/util';
import { createWatcher } from '../lib/watcher';
import { TContext } from '../types';

type TBuildFlags = 'dryRun' | 'watch' | 'typesOnly';

export default async function buildCommand(
  args: Array<string>,
  context: TContext,
) {
  const flags = parseCLIFlags<TBuildFlags>(
    {
      dryRun: ['--dry'],
      watch: ['--watch', '-w'],
      typesOnly: ['--types', '-t'],
    },
    args,
  );

  if (flags.dryRun) {
    context.logger.info('Dry Run, output will not be written to disk');
  }

  // Step 1: Look for and load config
  const config = await loadUserConfig({});
  if (config === null) process.exit(1);

  context.logger.debug('Resolved config', config);

  // Check if type definitions are disabled when running in types only mode
  if (flags.typesOnly !== false && config.typeDefinitionsOutput === false) {
    context.logger.error('Type definitions are disabled in the config');
    process.exit(1);
  }

  const fileCache = new Map();

  const markupFiles = await fg(config.entries, { absolute: true });
  const cssFiles = await fg(config.input, { absolute: true });

  await Promise.all(
    [...markupFiles, ...cssFiles].map(async (file) => {
      fileCache.set(file, await loadFiles([file], '', context));
    }),
  );

  const performWork = async () => {
    // Step 3: Run the parser and transformer
    context.logger.debug('Parsing CSS input');
    let start = performance.now();

    const code = cssFiles
      .map((file) => {
        const buffer = fileCache.get(file);
        if (!buffer) {
          context.logger.error(`Could not find file ${file}`);
          process.exit(1);
        }
        return buffer;
      })
      .reduce((acc, buffer) => {
        return Buffer.concat([acc, buffer]);
      }, Buffer.from(''));

    const transformed = parseTokensToUtilities({
      code,
      options: config,
    });

    context.logger.debug(
      `Parsed tokens to ${transformed.classNames.length} potential css classes`,
    );
    context.logger.debug(transformed.classNames.join(', '));

    const classesToGenerate: Array<string> = [];

    context.logger.debug('Parsing Markup');

    const markup = markupFiles
      .map((file) => {
        const buffer = fileCache.get(file);
        if (!buffer) {
          context.logger.error(`Could not find file ${file}`);
          process.exit(1);
        }
        return buffer;
      })
      .reduce((acc, buffer) => {
        return Buffer.concat([acc, buffer]);
      }, Buffer.from(''));

    const found = extractClassNamesFromString({
      code: markup.toString(),
      classNames: transformed.classNames,
    });

    if (found.length > 0) {
      classesToGenerate.push(
        ...found.map(({ classNames }) => classNames).flat(),
      );
    }

    if (classesToGenerate.length > 0) {
      context.logger.debug(
        `Found ${classesToGenerate.length} class(es) to generate`,
      );
    } else {
      context.logger.debug('Generating all utility classes');
    }

    if (config.output) {
      if (!flags.dryRun && !flags.typesOnly) {
        await writeFile(
          config.output,
          process.cwd(),
          transformed.generateCSS(classesToGenerate),
          context,
        );
      }

      if (flags.typesOnly) {
        context.logger.info(
          'Generating type definitions only, skipping CSS output.',
        );
      }
      if (flags.dryRun) {
        context.logger.info(`Dry Run, nothing was written to ${config.output}`);
      }
    }

    if (config.typeDefinitionsOutput !== false) {
      if (!flags.dryRun) {
        await writeFile(
          path.relative(process.cwd(), config.typeDefinitionsOutput),
          process.cwd(),
          transformed.generateTypeDefinitions(),
          context,
        );
      } else {
        context.logger.info(
          `Dry Run, nothing was written to ${config.typeDefinitionsOutput}`,
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
    const debouncedWork = debounce(performWork, 100);

    context.logger.info(
      'Running in watch mode. Will re-compile on changes to your css',
    );

    const files = [...config.entries, ...config.input];

    const watcher = createWatcher({
      entries: files,
    });

    context.logger.debug(files.join(', '));

    watcher.on('all', async (type, file) => {
      const absolutePath = path.resolve(process.cwd(), file);
      console.log(absolutePath);

      if (type.startsWith('unlink')) {
        fileCache.delete(absolutePath);
      } else {
        fileCache.set(
          absolutePath,
          await loadFiles([file], process.cwd(), context),
        );
      }

      context.logger.info('Change detected, recompiling');
      context.logger.debug(`File: ${file}`);
      context.logger.debug(`Change type: ${type}`);
      debouncedWork();
    });
  }
}
