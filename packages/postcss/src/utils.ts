import fs from 'node:fs/promises';
import path from 'node:path';

export const loadFileToString = async (
  file: string,
  rootDir: string,
): Promise<string> => {
  return await fs.readFile(path.join(rootDir, file), {
    encoding: 'utf-8',
  });
};

export const loadFiles = async (
  files: Array<string> = [],
  rootDir: string,
): Promise<Buffer> => {
  const buffers = await Promise.all(
    files.map((f) => {
      const file = path.join(rootDir, f);
      return fs.readFile(file);
    }),
  );

  return Buffer.concat(buffers);
};
