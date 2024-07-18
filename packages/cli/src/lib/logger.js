export const createLogger = (verbose = false) => ({
  log: (...args) => console.log(...args),
  info: (...args) => console.log('\x1b[94m[Info]\x1b[39m     ', ...args),
  error: (...args) => console.log('\x1b[91m[Error]\x1b[39m    ', ...args),
  success: (...args) => console.log('\x1b[92m[Success]\x1b[39m  ', ...args),
  debug: (...args) =>
    verbose ? console.log('\x1b[2m[Debug]\x1b[22m    ', ...args) : null,
});
