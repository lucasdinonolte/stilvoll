import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import stilvollPostcss from '@stilvoll/postcss';
import { flexRules, gapRules, gridRules } from '@stilvoll/rules';

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        stilvollPostcss({
          input: ['./src/index.css'],
          rules: [
            ...flexRules,
            ...gapRules,
            ...gridRules,
          ]
        })
      ]
    }
  },
  plugins: [react()],
})
