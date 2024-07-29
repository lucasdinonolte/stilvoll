import postcss from 'postcss';
import stilvoll from '@stilvoll/postcss';
import {
  flexRules,
  gapRules,
  gridRules,
  spacingRules,
  visibilityRules,
} from '@stilvoll/rules';

async function run() {
  const res = await postcss([
    stilvoll({
      input: ['./src/index.css'],
      classNameFormat: 'tailwind',
      rules: [
        ...flexRules,
        ...gridRules,
        ...gapRules,
        ...spacingRules,
        ...visibilityRules,
      ],
    }),
  ]).process('@stilvoll;', { from: undefined });

  console.log(res);
}

run();
