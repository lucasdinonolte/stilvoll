---
title: Config File
description: Configuring Stilvoll using a config file
---

Add a stilvoll.config.js file to the root of your project, or define the config inline based on your integration. Using a dedicated config file is the recommended way.

Check out the options for the config file below.

```javascript
// stilvoll.config.js
import { createConfig } from '@stilvoll/core';

export default createConfig({
  // Input tells Stilvoll where to look for your custom
  // properties and custom media breakpoints
  input: ['./src/index.css'],

  // Entries tells Stilvoll where to look for your markup,
  // so it can figure out which CSS classes to generate.
  //
  // accepts a glob pattern
  entries: ['**/*.{html,js,ts,jsx,tsx,vue,svelte,astro,elm,php,phtml,mdx,md}'],

  // Array of rules to generate utility rules
  rules: [['flex', { display: 'flex' }]],

  // Define your breakpoints (min-width based). By default stilvoll
  // will look for custom media definitions in your CSS. Setting
  // breakpoints in your config, will ignore any breakpoints found
  // in your code.
  breakpoints: {
    md: 720,
    lg: 1024,
  },

  // Where to output the utility CSS
  // (only used by the CLI, as postcss and vite plugin will just
  // inject into the tool's CSS bundle)
  output: './dist/utils.css',

  // Where to output the type definitions
  // (only used if you need direct access to the definitions file,
  // by default the index.d.ts file will be written to the stilvoll
  // package, so your code editor will automatically pick it up)
  //
  // Can be set to `false` to not generate type definitions
  typeDefinitionsOutput: './dist/index.d.ts',

  // Cascade Layer to wrap the utility styles in.
  // Wrapping code in a Cascade Layer can help to make handling
  // specificity issues simpler.
  //
  // By default stilvoll will not wrap the styles in a cascade
  // layer. Pass a string here to enable this feature.
  //
  // The example below will wrap all utility CSS in `@layer utilities`
  cascadeLayer: 'utilities',

  // Define the format of the utility classnames. Built in options
  // are `snakeCase` (default setting, generating `md_col_12`) and
  // `tailwind` (generating `md:col-12`). You can also pass a function
  // to roll your own class name formatting.
  //
  // Keep in mind that `snakeCase` is the recommended setting when
  // yout want to work with the typesafe sv import, as snake case
  // object keys don't need to be quoted in JavaScript.
  classNameFormat: ({ breakpoint, className }) => {
    const name = className
      .replaceAll('_', '-')
      .split('-')
      .filter((i) => i.toString().length > 0)
      .map((i) => i.toLowerCase())
      .join('-');
    const cls = breakpoint ? `${name}@${breakpoint}` : name;
    return `u-${cls}`;
  },
});
```
