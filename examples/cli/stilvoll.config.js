import {
  flexRules,
  gapRules,
  gridRules,
  spacingRules,
  visibilityRules,
} from '@stilvoll/rules';

export default {
  input: ['./src/input.css'],
  output: './dist/utils.css',
  entries: ['./src/pages/**/*.html'],
  typeDefinitions: './dist/types.d.ts',
  classNameFormat: 'tailwind',
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
  rules: [
    ...flexRules,
    ...gridRules,
    ...gapRules,
    ...spacingRules,
    ...visibilityRules,
  ],
};
