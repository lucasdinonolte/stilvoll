import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';
import { createServer as createViteServer, createLogger } from 'vite';
import getPort from 'get-port';
import open from 'open';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();
  const logger = createLogger('info', {
    prefix: '[Server]',
  });

  const vite = await createViteServer({
    server: { middlewareMode: true, host: '0.0.0.0' },
    appType: 'custom',
  });

  const port = await getPort({ port: 3000 });

  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template = fs.readFileSync(
        path.resolve(__dirname, '../index.html'),
        'utf-8'
      );

      template = await vite.transformIndexHtml(url, template);
      const { render } = await vite.ssrLoadModule('./src/entry-server.jsx');
      const appHtml = await render(url);
      const html = template.replace(`<!--ssr-outlet-->`, appHtml);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(port);
  logger.info(`Started`, {
    timestamp: true,
  });
  logger.info('', { timestamp: true });
  logger.info(`http://localhost:${port}`, { timestamp: true });

  await open(`http://localhost:${port}`);
}

createServer();
