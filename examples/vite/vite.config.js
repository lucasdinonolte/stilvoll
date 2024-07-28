import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import stilvoll from '@stilvoll/vite-plugin';
import {
  flexRules,
  gapRules,
  gridRules,
  spacingRules,
  visibilityRules,
} from '@stilvoll/rules';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    stilvoll({
      input: ['./src/index.css'],
      rules: [
        ...flexRules,
        ...gridRules,
        ...gapRules,
        ...spacingRules,
        ...visibilityRules,
      ],
      breakpoints: {
        sm: 600,
        md: 920,
        lg: 1200,
      },
    }),
  ],
});
