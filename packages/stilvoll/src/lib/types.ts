export type UtilityMap = {
  /**
   * It appears that stilvoll didn't run just yet.
   * Make sure to run it as either the vite plugin or
   * using the standalone CLI to generate type definitions
   * from your CSS tokens.
   */
  not_generated: never;
};

export type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | bigint
  | null
  | boolean
  | UtilityMap
  | undefined;
export type ClassDictionary = Record<string, any>;
export type ClassArray = ClassValue[];
