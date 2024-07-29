import path from 'node:path';
import { createRequire } from 'node:module';

export const defaultFileSystemGlobs = [
  '**/*.{html,js,ts,jsx,tsx,vue,svelte,astro,elm,php,phtml,mdx,md}',
];
const require = createRequire(import.meta.url);
export const defaultTypeDefinitionsPath = path.join(
  require.resolve('stilvoll'),
  '../index.d.ts',
);

