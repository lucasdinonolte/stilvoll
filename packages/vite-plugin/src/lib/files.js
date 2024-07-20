import fs from 'node:fs/promises';

export const loadFiles = async (files = []) => {
  const buffers = await Promise.all(
    files.map((file) => {
      return fs.readFile(file);
    }),
  );

  return Buffer.concat(buffers);
};

export const writeFile = async (file, content) => {
  try {
    await fs.writeFile(file, content);
  } catch (e) {
    console.log(e);
  }
};
