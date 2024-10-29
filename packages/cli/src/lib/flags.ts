const isFlag = (str: string) => str.startsWith('--') || str.startsWith('-');

export const parseCLIFlags = <T extends string>(
  flags: Record<T, Array<string>>,
  args: Array<string>,
): Record<T, boolean> => {
  const res = Object.keys(flags).reduce((acc, cur) => {
    acc[cur] = false;
    return acc;
  }, {});

  args.filter(isFlag).forEach((cur) => {
    const key = Object.keys(flags).find((k) => flags[k]?.includes(cur));
    if (!key) {
      console.log(`Unknown option ${cur}`);
      process.exit(1);
    }
    res[key] = true;
  });

  return res as Record<T, boolean>;
};
