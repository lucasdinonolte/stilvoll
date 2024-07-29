import postcss from 'postcss';
import stilvoll from '@stilvoll/postcss';

async function run() {
  const res = await postcss([stilvoll({})]).process('@stilvoll;', {
    from: undefined,
  });

  console.log(res);
}

run();
