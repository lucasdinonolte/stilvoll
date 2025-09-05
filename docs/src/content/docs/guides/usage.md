---
title: Using Stilvoll
description: How to access your utility styles
---

All utility classes specified in your configuration are accessible through the `sv` proxy. Please note that class name chaining on the proxy is not currently supported; therefore, if you need to apply multiple classes, a utility such as `classnames` or `clsx` will be beneficial.

See [config file options](/guides/config-file) and the [creating rules guide](/guides/creating-rules) to learn how to tweak the available utility classes.

```jsx
import { sv } from 'stilvoll';
import cn from 'clsx';

function() {
  return (
    <div className={cn(sv.grid, sv.grid_cols_12)}>
        <div className={sv.col_6}>Half width column</div>
        <div className={cn(sv.hidden, sv.block_md, sv.col_6)}>
            Half width column only visible from the md breakpoint
        </div>
    </div>
  );
}
```

## Use without the sv Proxy

Not using JSX, or don't want to use the `sv` proxy? No problem, as stilvoll also supports referencing utility classes by their name directly.

```html
<div class="grid grid_cols_12">
  <div class="col_6">Half width column</div>
  <div class="hidden block_md col_6">
    Half width column only visible from the md breakpoint
  </div>
</div>
```

### Change the classname format

By default Stilvoll generates utility classnames using `snake_case`, as this allows them to be accessed without brackets and quotes from the `sv` proxy in JavaScript. However, if you're not planning to use the `sv` proxy, this might not be the most convenient format. In your config file you can tweak the format of the generated CSS class names by setting the `classNameFormat` option.

```js
// stilvoll.config.js
import { createConfig } from '@stilvoll/core';

export default createConfig({
  input: ['./src/index.css'],

  // Define the format of the utility classnames. Built in options
  // are `snakeCase` (default setting, generating `md_col_12`) and
  // `tailwind` (generating `md:col-12`). You can also pass a function
  // to roll your own class name formatting.
  //
  // Keep in mind that `snakeCase` is the recommended setting when
  // yout want to work with the typesafe sv import, as snake case
  // object keys don't need to be quoted in JavaScript.
  classNameFormat: 'tailwind',
});
```

With these settings the above example can now be written like this:

```html
<div class="grid grid-cols-12">
  <div class="col-6">Half width column</div>
  <div class="hidden md:block col-6">
    Half width column only visible from the md breakpoint
  </div>
</div>
```
