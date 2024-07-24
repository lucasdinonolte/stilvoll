import path from 'node:path';

import {
  parseTokensToUtilities,
  extractClassNamesFromString,
  validateConfig,
  hashClassName,
} from '@stilvoll/core';

import { loadFiles, writeFile } from './lib/files.js';

const STILVOLL_VIRTUAL_MODULE_ID = 'virtual:util.css';
const STILVOLL_REPLACE_STRING = '.u____{display:none}';

export default function tokenUtilityCSSPlugin(_options) {
  const {
    files: inputFiles,
    typeDefinitions,
    hashClassNames = false,
    ...rest
  } = validateConfig(_options);

  const virtualModuleId = STILVOLL_VIRTUAL_MODULE_ID;
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  const files = inputFiles.map((f) => path.join(process.cwd(), f));

  let transformed = null;
  const classNames = [];

  const performWork = async () => {
    const code = await loadFiles(files);
    transformed = parseTokensToUtilities({
      code,
      options: {
        ...rest,
        classNameCase: 'snake',
      },
    });

    if (typeDefinitions !== false) {
      await writeFile(typeDefinitions, transformed.generateTypeDefinitions());
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
      resolveId(id) {
        if (id === virtualModuleId) {
          return resolvedVirtualModuleId;
        }
      },
      load(id) {
        if (id === resolvedVirtualModuleId) {
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
      transform(code) {
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
                  `"${cur.classNames.map(hashClassNames ? hashClassName : (x) => x).join(' ')}"`,
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
      resolveId(id) {
        if (id === virtualModuleId) {
          return resolvedVirtualModuleId;
        }
      },
      load(id) {
        if (id === resolvedVirtualModuleId) {
          return {
            code: STILVOLL_REPLACE_STRING,
          };
        }
      },
      generateBundle(_, bundle) {
        const files = Object.keys(bundle).filter((i) => i.endsWith('.css'));

        for (const file of files) {
          const chunk = bundle[file];
          if (chunk.type === 'asset' && typeof chunk.source === 'string') {
            const css = chunk.source.replace(
              STILVOLL_REPLACE_STRING,
              transformed
                .generateCSS(classNames, {
                  hash: hashClassNames,
                  skipComment: true,
                })
                .trim()
                .replaceAll('\n', ''),
            );
            chunk.source = css;
          }
        }
      },
    },
  ];
}
