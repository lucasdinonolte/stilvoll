# Token to Utility CSS

CLI and Vite Plugin to auto-generate utility CSS from your CSS design tokens (custom properties).

```css
/* Turns this... */
:root {
  --color-blue: #0000ff;
}

/* ...into this */
:root {
  --color-blue: #0000ff;
}

.c-blue {
  color: var(--color-blue);
}

.bg-blue {
  background-color: var(--color-blue);
}
```
