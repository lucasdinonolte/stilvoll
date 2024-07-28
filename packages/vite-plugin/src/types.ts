import type { TRule } from "@stilvoll/core";

export type TPluginConfig = {
  input: Array<string>;
  rules: Array<TRule>;
  breakpoints?: Record<string, number>;
}
