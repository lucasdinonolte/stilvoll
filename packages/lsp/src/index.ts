import log from './utils/logger';
import type { RequestMessage, RequestMethod, NotificationMethod } from './types';

import { completion } from './methods/completion';
import { initialize } from './methods/initialize';

let buffer = '';

const methodLookup: Record<string, RequestMethod | NotificationMethod> = {
  "textDocument/completion": completion,
  initialize,
};

const respond = (id: RequestMessage["id"], result: object | null) => {
  const message = JSON.stringify({ id, result });
  const messageLength = Buffer.byteLength(message, "utf-8");
  const header = `Content-Length: ${messageLength}\r\n\r\n`;

  log.write(header + message);
  process.stdout.write(header + message);
};

process.stdin.on('data', async (chunk) => {
  buffer += chunk;

  while (true) {
    const lenMatch = buffer.match(/Content-Length: (\d+)\r\n/);
    if (!lenMatch) break;

    const len = parseInt(lenMatch[1], 10);
    const messageStart = buffer.indexOf("\r\n\r\n") + 4;

    if (buffer.length < messageStart + len) break;

    try {
      const raw = buffer.slice(messageStart, messageStart + len);
      const message = JSON.parse(raw);

      log.write({ id: message.id, method: message.method, params: message.params });
    
      const method = methodLookup[message.method];

      if (method) {
        const result = await method(message);

        if (result !== undefined) {
          respond(message.id, result);
        }
      }
    } catch (e) {
log.write(e);
    } finally {
      buffer = buffer.slice(messageStart + len);
    }
  }
});
