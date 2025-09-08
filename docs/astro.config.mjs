import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Stilvoll',
      description: 'Utility stylesheets without the drama',
      social: {
        github: 'https://github.com/lucasdinonolte/stilvoll',
      },
      editLink: {
        baseUrl: 'https://github.com/lucasdinonolte/stilvoll/edit/main/docs',
      },
      sidebar: [
        {
          label: 'Guides',
          items: [
            // Each item here is one entry in the navigation menu.
            { label: 'Getting Started', slug: 'guides' },
            { label: 'Using Stilvoll', slug: 'guides/usage' },
            { label: 'Config File', slug: 'guides/config-file' },
            { label: 'Creating Rules', slug: 'guides/creating-rules' },
            { label: 'Why Stilvoll', slug: 'guides/why' },
          ],
        },
        {
          label: 'Integrations',
          items: [
            { label: 'Vite', slug: 'integrations/vite' },
            { label: 'PostCSS', slug: 'integrations/postcss' },
            { label: 'CLI', slug: 'integrations/cli' },
            { label: 'Programmatic Usage', slug: 'integrations/programmatic-usage' },
          ],
        },
      ],
    }),
  ],
});
