import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Pages from 'vite-plugin-pages';
import svgr from 'vite-plugin-svgr';
import imagePresets, { widthPreset } from 'vite-plugin-image-presets';
import stilvoll from '@stilvoll/vite-plugin';

export default defineConfig({
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },

  /**
   * Only env variables prefixed with PUBLIC_ will be exposed to the
   * client side code. This prevents exposing secrets accidentally.
   */
  envPrefix: 'PUBLIC_',
  plugins: [
    react(),
    Pages({
      dirs: './src/pages/',
      exclude: ['**/_*.jsx'],
      extensions: ['jsx'],
      moduleId: '@routes',
      resolver: 'react',
      routeStyle: 'next',
      importMode: 'sync',
    }),
    stilvoll({
      files: ['./src/styles/variables.css', './src/styles/breakpoints.css'],
      output: './src/styles/utils.css',
      rules: [['flex', { display: 'flex' }]],
    }),

    /**
     * Automatically turn all SVG imports into React components.
     * This overwrites vite's default behavior of loading SVGs using
     * the file loeder. You can opt out this, by setting exportAsDefault
     * to false. In that case an SVG import will have the file path on
     * the default import and the ReactComponent on the { ReactComponent }
     * named import.
     */
    svgr({
      exportAsDefault: true,
    }),

    /**
     * The default preset generates webp srcsets for imported images on
     * the fly. To use it you have to append it to the imports search
     * parameter like this:
     *
     * import myImg from '@assets/image.jpg?preset=default';
     */
    imagePresets({
      default: widthPreset({
        widths: [300, 600, 1200, 2000],
        formats: {
          webp: {},
        },
      }),
    }),
  ],

  test: {
    environment: 'jsdom',
    setupFiles: 'test.setup.js',
  },
});
