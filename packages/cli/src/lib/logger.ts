export type TLogger = ReturnType<typeof createLogger>;

export const createLogger = (verbose = false) => ({
  log: (...args: Array<any>) => console.log(...args),
  info: (...args: Array<any>) =>
    console.log('\x1b[94m[Info]\x1b[39m     ', ...args),
  error: (...args: Array<any>) =>
    console.log('\x1b[91m[Error]\x1b[39m    ', ...args),
  success: (...args: Array<any>) =>
    console.log('\x1b[92m[Success]\x1b[39m  ', ...args),
  debug: (...args: Array<any>) =>
    verbose ? console.log('\x1b[2m[Debug]\x1b[22m    ', ...args) : null,
});
