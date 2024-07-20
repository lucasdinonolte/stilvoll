import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import { watchFile } from 'node:fs';

export const loadPkg = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const pkg = await fs.readFile(
    path.join(__dirname, '../../', 'package.json'),
    'utf8',
  );
  return JSON.parse(pkg);
};

export const loadFiles = async (files = [], rootDir, { logger }) => {
  const buffers = await Promise.all(
    files.map((f) => {
      const file = path.join(rootDir, f);
      logger.debug(`Loading input file ${f}`);
      return fs.readFile(file);
    }),
  );

  return Buffer.concat(buffers);
};

export const writeFile = async (file, rootDir, content, { logger }) => {
  const filePath = path.join(rootDir, file);
  try {
    logger.debug(`Writing to ${filePath}`);
    await fs.writeFile(filePath, content);
  } catch (e) {
    logger.error(`Could not write ${filePath}`, e);
  }
};

export const watchFiles = (files, rootDir, callback, { logger }) => {
  const filePaths = files.map((f) => path.join(rootDir, f));

  for (const file of filePaths) {
    watchFile(file, (current, previous) => {
      logger.debug(
        `Change detected to ${file}. ${current.mtime} ${previous.mtime}`,
      );
      if (current.mtime !== previous.mtime) {
        logger.info(`${file} changed. Rerunning`);
        callback();
      }
    });
  }
};
