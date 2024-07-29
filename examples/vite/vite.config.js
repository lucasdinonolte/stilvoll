import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import stilvoll from '@stilvoll/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    stilvoll(),
  ],
});
