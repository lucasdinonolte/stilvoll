import path from 'node:path';

import {
  parseTokensToUtilities,
  extractClassNamesFromString,
  validateConfig,
  hashClassName,
} from '@stilvoll/core';
import { loadFiles, writeFile } from './lib/files.js';

export default function tokenUtilityCSSPlugin(_options) {
  const {
    files: inputFiles,
    typeDefinitions,
    hashClassNames = false,
    ...rest
  } = validateConfig(_options);

  const virtualModuleId = 'virtual:util.css';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  const files = inputFiles.map((f) => path.join(process.cwd(), f));

  let transformed = null;
  const classNames = [];

  const performWork = async () => {
    const code = await loadFiles(files);
    transformed = parseTokensToUtilities({
      code,
      options: rest ?? {},
    });

    if (typeDefinitions !== false) {
      await writeFile(typeDefinitions, transformed.generateTypeDefinitions());
    }
  };

  return [
    {
      // Dev plugin
      apply: 'serve',
      name: 'token-utility-css:parser-dev',
      buildStart: performWork,
      handleHotUpdate({ file }) {
        if (files.includes(file)) {
          performWork();
        }
      },
    },
    {
      apply: 'serve',
      name: 'token-utility-css:virtual-dev',
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
      name: 'token-utility-css:parser-build',
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
      name: 'token-utility-css:virtual-build',
      resolveId(id) {
        if (id === virtualModuleId) {
          return resolvedVirtualModuleId;
        }
      },
      load(id) {
        if (id === resolvedVirtualModuleId) {
          return {
            code: '.u____{display:none}',
          };
        }
      },
      generateBundle(_, bundle) {
        const files = Object.keys(bundle).filter((i) => i.endsWith('.css'));

        for (const file of files) {
          const chunk = bundle[file];
          if (chunk.type === 'asset' && typeof chunk.source === 'string') {
            const css = chunk.source.replace(
              '.u____{display:none}',
              transformed
                .generateCSS(classNames, hashClassNames, true)
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
