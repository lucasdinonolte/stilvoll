import { visibility } from './utilities/visibility.js';
import { space } from './utilities/space.js';
import { container } from './utilities/container.js';
import { mergeWithDefaultSettings } from './settings.js';
import { deepMergeAll } from './merge.js';

const stilvollPresetDefault = (_options) => {
  const settings = mergeWithDefaultSettings(_options);

  return deepMergeAll(
    visibility(settings),
    space(settings),
    container(settings),
  );
};

export default stilvollPresetDefault;
