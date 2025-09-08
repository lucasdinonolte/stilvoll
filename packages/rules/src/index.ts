import type { TRule } from '@stilvoll/core';
import { colorRules } from './rules';
import { flexRules } from './rules';
import { gridRules, makeGridRules } from './rules';
import { spacingRules } from './rules';
import { visibilityRules } from './rules';

export { colorRules, flexRules, gridRules, makeGridRules, spacingRules, visibilityRules };

export default [
  ...colorRules,
  ...flexRules,
  ...gridRules,
  ...spacingRules,
  ...visibilityRules,
] as Array<TRule>;
