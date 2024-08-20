# Fluid Scale

A simple tool to help with generating `clamp` values for font-size (and spacing values) that scale seamlessly with the viewport.

Meant to be used in code generation workflows.

## What it does

```js
import { createFluid } from '@stilvoll/fluid-scale';

const { fluid } = createFluid({
  minViewport: '320px',
  maxViewport: '1600px',
  baseFontSize: '16px',
});

const textMd = fluid('18px', '24px');
```
