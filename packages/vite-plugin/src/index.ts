import path from 'node:path';
import type { OutputChunk, OutputAsset, OutputOptions } from 'rollup';

import {
  parseTokensToUtilities,
  extractClassNamesFromString,
  loadUserConfig,
  TParseResult,
  defaultTypeDefinitionsPath,
  TUserConfig,
} from '@stilvoll/core';

import { loadFiles, writeFile } from './lib/files';

const STILVOLL_VIRTUAL_MODULE_ID = 'virtual:stilvoll.css';
const STILVOLL_REPLACE_STRING = '.u____{display:none}';

export default async function tokenUtilityCSSPlugin(_options: Partial<TUserConfig>) {
  const { input: inputFiles, ...rest } = await loadUserConfig(_options);

  const virtualModuleId = STILVOLL_VIRTUAL_MODULE_ID;
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  const files = inputFiles.map((f) => path.join(process.cwd(), f));

  let transformed: TParseResult | null = null;
  const classNames: Array<string> = [];

  const performWork = async () => {
    const code = await loadFiles(files);
    transformed = parseTokensToUtilities({
      code,
      options: {
        ...rest,
      },
    });

    if (transformed) {
      await writeFile(
        defaultTypeDefinitionsPath,
        transformed.generateTypeDefinitions(),
      );
    }
  };

  return [
    {
      // Dev plugin
      apply: 'serve',
      name: 'stilvoll:parser-dev',
      buildStart: performWork,
      handleHotUpdate({ file }) {
        if (files.includes(file)) {
          performWork();
        }
      },
    },
    {
      apply: 'serve',
      name: 'stilvoll:virtual-dev',
      resolveId(id: string) {
        if (id === virtualModuleId) {
          return resolvedVirtualModuleId;
        }
      },
      load(id: string) {
        if (id === resolvedVirtualModuleId && transformed) {
          return {
            code: transformed.generateCSS(),
          };
        }
      },
    },

    // Build plugin
    {
      apply: 'build',
      name: 'stilvoll:parser-build',
      enforce: 'pre',
      buildStart: performWork,
      transform(code: string) {
        if (transformed === null) return;

        const found = extractClassNamesFromString({
          code,
          classNames: transformed.classNames,
          objectTokensOnly: true,
        });

        if (found.length > 0) {
          classNames.push(...found.map(({ classNames }) => classNames).flat());

          return {
            code: found.reduce((prev, cur) => {
              if (cur.isObjectToken) {
                return prev.replaceAll(
                  cur.token,
                  `"${cur.classNames.join(' ')}"`,
                );
              } else {
                return prev;
              }
            }, code),
          };
        }
      },
    },
    {
      apply: 'build',
      enforce: 'post',
      name: 'stilvoll:virtual-build',
      resolveId(id: string) {
        if (id === virtualModuleId) {
          return resolvedVirtualModuleId;
        }
      },
      load(id: string) {
        if (id === resolvedVirtualModuleId) {
          return {
            code: STILVOLL_REPLACE_STRING,
          };
        }
      },
      generateBundle(
        _: OutputOptions,
        bundle: { [fileName: string]: OutputAsset | OutputChunk },
      ) {
        if (!transformed) return;

        const files = Object.keys(bundle).filter((i) => i.endsWith('.css'));

        for (const file of files) {
          const chunk = bundle[file];
          if (
            chunk &&
            chunk.type === 'asset' &&
            typeof chunk.source === 'string'
          ) {
            const css = chunk.source.replace(
              STILVOLL_REPLACE_STRING,
              transformed.generateCSS(classNames).trim().replaceAll('\n', ''),
            );
            chunk.source = css;
          }
        }
      },
    },
  ];
}
