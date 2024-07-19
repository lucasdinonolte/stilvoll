import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tokenUtilityCSS from '@lucasdinonolte/token-utility-css-vite-plugin';

const tokenizer = () => {
  let found = new Set();

  const virtualModuleId = 'virtual:my-module';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return [
    {
      name: 'token-scanner',
      transform: (code) => {
        const splitRE = /[\\:]?[\s'"`;{}(),]+/g;
        const chunks = code.split(splitRE);

        for (const token of chunks) {
          if (token.startsWith('u.')) {
            found.add(token);
          }
        }
      },
    },
    {
      name: 'token-dev',
      enforce: 'post',
      transform: (code) => {
        if (code.includes('import.meta.hot')) {
          let hmr = `let ___classNames = ${JSON.stringify([
            ...found,
          ])}; console.log(___classNames);`;

          return {
            code: `${code}\nif (import.meta.hot){${hmr}}`,
          };
        }
      },
    },
  ];
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tokenizer(),
    tokenUtilityCSS({
      files: ['./src/index.css'],
      output: './src/styles/utils.css',
      utilities: {
        color: {
          customPropertyRegex: /^--color-/,
          utilities: {
            c: ['color'],
          },
        },
      },
    }),
  ],
});
