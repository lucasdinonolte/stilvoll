import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';

export const loadPkg = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const pkg = await fs.readFile(
    path.join(__dirname, '../', 'package.json'),
    'utf8',
  );
  return JSON.parse(pkg);
};

export const fileExists = async (file: string, rootDir: string) => {
  try {
    await fs.access(path.join(rootDir, file));
    return true;
  } catch (e) {
    return false;
  }
};

export const loadFiles = async (
  files: Array<string> = [],
  rootDir: string,
  { logger },
) => {
  const buffers = await Promise.all(
    files.map((f) => {
      const file = path.join(rootDir, f);
      logger.debug(`Loading input file ${f}`);
      return fs.readFile(file);
    }),
  );

  return Buffer.concat(buffers);
};

export const writeFile = async (
  file: string,
  rootDir: string,
  content: string,
  { logger },
) => {
  const filePath = path.join(rootDir, file);
  try {
    logger.debug(`Writing to ${filePath}`);
    await fs.writeFile(filePath, content);
  } catch (e) {
    logger.error(`Could not write ${filePath}`, e);
  }
};
