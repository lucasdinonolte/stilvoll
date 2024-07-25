import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.join(__dirname, p);

const template = fs.readFileSync(toAbsolute('../dist/index.html'), 'utf-8');
const { render } = await import('../dist/server/entry-server.js');
const isDynamicRoute = (slug) => slug.includes('[');

const routesToPrerender = globSync(toAbsolute('../src/pages/**/*.jsx'))
  .map((file) => {
    const name = path.basename(file, '.jsx');
    return name === 'index' ? `/` : `/${name}`;
  })
  .filter((route) => !isDynamicRoute(route));

console.log('');
console.log('Pre-Rendering routes');
(async () => {
  // pre-render each route...
  for (const url of routesToPrerender) {
    const context = {};
    const appHtml = await render(url, context);

    const html = template.replace(`<!--ssr-outlet-->`, appHtml);

    const filePath = `../dist${url === '/' ? '/index' : `${url}/index`}.html`;
    fs.ensureFileSync(toAbsolute(filePath));
    fs.writeFileSync(toAbsolute(filePath), html);
    console.log(filePath);
  }
})();
