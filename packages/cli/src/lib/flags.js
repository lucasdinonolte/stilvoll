const isFlag = (str) => str.startsWith('--') || str.startsWith('-');

export const parseCLIFlags = (flags, args) => {
  const res = Object.keys(flags).reduce((acc, cur) => {
    acc[cur] = false;
    return acc;
  }, {});

  args.filter(isFlag).forEach((cur) => {
    const key = Object.keys(flags).find((k) => flags[k].includes(cur));
    if (!key) {
      console.log(`Unknown option ${cur}`);
      process.exit(1);
    }
    res[key] = true;
  });

  return res;
};
