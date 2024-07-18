import path from 'node:path';

import { parseTokensToUtilities } from '@lucasdinonolte/token-utility-css-core';
import { loadFiles, writeFile } from './lib/files.js';

export default function tokenUtilityCSSPlugin({
  files: inputFiles = [],
  output = './utils.css',
  ...rest
}) {
  const files = inputFiles.map((f) => path.join(process.cwd(), f));

  const performWork = async () => {
    const code = await loadFiles(files);
    const transformed = parseTokensToUtilities({
      code,
      options: rest ?? {},
    });
    await writeFile(path.join(process.cwd(), output), transformed.getCSS());
  };

  return {
    name: 'token-utility-css',
    buildStart: performWork,
    handleHotUpdate({ file }) {
      if (files.includes(file)) {
        performWork();
      }
    },
  };
}
