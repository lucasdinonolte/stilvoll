import { color } from './utilities/color.js';
import { container } from './utilities/container.js';
import { grid } from './utilities/grid.js';
import { space } from './utilities/space.js';
import { visibility } from './utilities/visibility.js';

import { deepMergeAll } from './merge.js';
import { mergeWithDefaultSettings } from './settings.js';

const stilvollPresetDefault = (_options = {}) => {
  const settings = mergeWithDefaultSettings(_options);

  return deepMergeAll(
    color(settings),
    container(settings),
    grid(settings),
    space(settings),
    visibility(settings),
  );
};

export default stilvollPresetDefault;
