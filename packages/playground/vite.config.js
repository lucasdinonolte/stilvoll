import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tokenUtilityCSS from '@lucasdinonolte/token-utility-css-vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tokenUtilityCSS({
      files: ['./src/index.css'],
      output: './src/styles/utils.css',
    }),
  ],
});
