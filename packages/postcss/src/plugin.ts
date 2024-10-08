import postcss from 'postcss';
import fg from 'fast-glob';
import { normalize } from 'node:path';

import type { Result, Root } from 'postcss';
import type { TUserConfig } from '@stilvoll/core';

import {
  loadUserConfig,
  extractClassNamesFromString,
  parseTokensToUtilities,
} from '@stilvoll/core';

import { loadFiles, loadFileToString, writeStringToFile } from './utils';

const STILVOLL_AT_RULE = 'stilvoll';

export const createPlugin = async (_options: Partial<TUserConfig> = {}) => {
  const options = await loadUserConfig(_options);

  const fileMap = new Map();
  const fileClassMap = new Map();
  const classes = new Set<string>();

  return async (root: Root, result: Result) => {
    const code = await loadFiles(options.input, process.cwd());

    const transformed = parseTokensToUtilities({
      code,
      options,
    });

    if (options.typeDefinitionsOutput !== false) {
      writeStringToFile(
        transformed.generateTypeDefinitions(),
        options.typeDefinitionsOutput,
        '',
      );
    }

    const entries = (await fg(options.entries, {
      cwd: process.cwd(),
      absolute: true,
      ignore: ['**/node_modules/**'],
      stats: true,
    })) as unknown as { path: string; mtimeMs: number }[];

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];

      if (!entry) continue;

      result.messages.push({
        type: 'dependency',
        file: normalize(entry.path),
        parent: result.opts.from?.split('?')[0],
        plugin: 'stilvoll-postcss',
      });

      if (fileMap.has(entry.path) && fileMap.get(entry.path) >= entry.mtimeMs) {
        continue;
      } else {
        fileMap.set(entry.path, entry.mtimeMs);
      }

      const code = await loadFileToString(entry.path, '');
      const classes = extractClassNamesFromString({
        code,
        classNames: transformed.classNames,
      }).map(({ classNames }) => classNames);

      fileClassMap.set(entry.path, classes);
    }

    root.walkAtRules((rule) => {
      if (rule.name === STILVOLL_AT_RULE) {
        for (const set of fileClassMap.values()) {
          for (const candidate of set) classes.add(candidate);
        }

        const source = rule.source;
        const cssString = transformed.generateCSS([...classes].flat());
        const css = postcss.parse(cssString);
        css.walkDecls((decl) => {
          decl.source = source;
        });
        rule.replaceWith(css);
      }
    });
  };
};
