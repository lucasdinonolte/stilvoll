import { flexRules, gapRules, spacingRules, visibilityRules } from "@stilvoll/rules";

export default {
  input: ['./src/input.css'],
  output: './dist/utils.css',
  entries: ['./src/pages/**/*.html'],
  typeDefinitions: './dist/types.d.ts',
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
  rules: [
    ...flexRules,
    ...gapRules,
    ...spacingRules,
    ...visibilityRules
  ],
};
