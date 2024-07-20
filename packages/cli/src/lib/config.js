import path from 'node:path';
import fs from 'node:fs/promises';

import { validateConfig } from '@stilvoll/core';

export const loadConfig = async (configFileName, rootDir, { logger }) => {
  const configFilePath = path.join(rootDir, configFileName);
  try {
    logger.debug(`Loading config file from ${configFilePath}`);
    await fs.access(configFilePath);
    const { default: config } = await import(configFilePath);
    return validateConfig(config);
  } catch (error) {
    if (error.code === 'ENOENT') {
      logger.error(`No ${configFileName} file found in the current directory.`);
    } else {
      logger.error('Error importing config file:', error);
    }
    return null;
  }
};
