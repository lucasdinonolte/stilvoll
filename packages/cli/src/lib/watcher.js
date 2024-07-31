import { watch } from 'chokidar'

let watcher;

export const createWatcher = ({ entries = [], cwd = process.cwd() } = {}) => {
  if (watcher) return watcher;

  watcher = watch(entries, {
    ignoreInitial: true,
    ignorePermissionErrors: true,
    ignored: ['**/{.git,node_modules}/**'],
    cwd,
  });

  return watcher;
};
