import {
  flexRules,
  gapRules,
  gridRules,
  spacingRules,
  visibilityRules,
} from '@stilvoll/rules';

export default {
  input: ['./src/index.css'],
  rules: [
    ...flexRules,
    ...gridRules,
    ...gapRules,
    ...spacingRules,
    ...visibilityRules,
  ],
};
