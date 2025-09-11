import fs from 'node:fs/promises';
import { join } from 'node:path';
import { loadUserConfig, parseTokensToUtilities } from '@stilvoll/core';
import type { RequestMessage } from '../types';
import { cache } from '../utils/cache';

type ServerCapabilities = Record<string, unknown>;

interface InitializeResult {
  capabilities: ServerCapabilities;

  serverInfo?: {
    name: string;
    version?: string;
  };
}

interface InitializeParams {
  rootPath: string;
}

export const initialize = async (message: RequestMessage): Promise<InitializeResult> => {
  const params =  message.params as InitializeParams;

  const options = await loadUserConfig({}, params.rootPath);

  const inputCode = await Promise.all(options.input.map(file => fs.readFile(join(params.rootPath, file), 'utf8')));
  const transformed = parseTokensToUtilities({ code: inputCode.join('\n'), options });

  cache.set('classnames', transformed.classNames);

  return {
    capabilities: {
      completionProvider: {},
      textDocumentSync: 1,
    },
    serverInfo: {
      name: "stilvoll",
      version: "0.0.1",
    },
  };
};
