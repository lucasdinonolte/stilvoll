import { createConfig } from '@stilvoll/core';

import {
  flexRules,
  gapRules,
  gridRules,
  spacingRules,
  visibilityRules,
} from '@stilvoll/rules';

export default createConfig({
  input: ['./src/input.css'],
  output: './dist/utils.css',
  entries: [],
  banner: () => 
    `/* AUTO GENERATED ON ${new Date().toISOString()} */`,
  /**
   * This is an example of a custom className
   * formatter
   */
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
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
  minifyOutput: false,
  rules: [
    ...flexRules,
    ...gridRules,
    ...gapRules,
    ...spacingRules,
    ...visibilityRules,
  ],
});
