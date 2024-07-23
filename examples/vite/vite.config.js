import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import stilvoll from '@stilvoll/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    stilvoll({
      files: ['./src/index.css'],
      output: './src/styles/utils.css',
      breakpoints: {
        sm: 600,
        md: 920,
        lg: 1200,
      },
    }),
  ],
});
