import {
  flexRules,
  gapRules,
  gridRules,
  spacingRules,
  visibilityRules,
} from '@stilvoll/rules';

export default {
  input: ['./src/app/globals.css'],
  rules: [
    ...flexRules,
    ...gridRules,
    ...gapRules,
    ...spacingRules,
    ...visibilityRules,
  ],
};
