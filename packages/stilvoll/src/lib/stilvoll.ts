import type { UtilityMap } from './types';

export const sv = new Proxy(
  {},
  {
    get(_, prop) {
      return prop.toString();
    },
  },
) as UtilityMap;
