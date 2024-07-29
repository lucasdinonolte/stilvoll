import type { TUserConfig } from '@stilvoll/core';
import type { Result, Root } from 'postcss';

function stilvollPostCSSPlugin(options: Partial<TUserConfig>) {
  let promise:
    | Promise<(root: Root, result: Result) => Promise<void>>
    | undefined;

  return {
    postcssPlugin: 'stilvoll-postcss',
    plugins: [
      async (root: Root, result: Result) => {
        if (!promise)
          promise = import('@stilvoll/postcss/esm').then((r) =>
            r.createPlugin(options),
          );
        return await (
          await promise
        )(root, result);
      },
    ],
  };
}

stilvollPostCSSPlugin.postcss = true;
stilvollPostCSSPlugin.default = stilvollPostCSSPlugin;

export default stilvollPostCSSPlugin;
