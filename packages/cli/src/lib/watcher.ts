import { FSWatcher, watch } from 'chokidar';

let watcher: FSWatcher;

export const createWatcher = ({
  entries = [],
  cwd = process.cwd(),
}: { entries?: Array<string>; cwd?: string } = {}) => {
  if (watcher) return watcher;

  watcher = watch(entries, {
    ignoreInitial: true,
    ignorePermissionErrors: true,
    ignored: ['**/{.git,node_modules}/**'],
    cwd,
  });

  return watcher;
};
