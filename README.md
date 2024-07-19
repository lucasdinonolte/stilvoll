# Token to Utility CSS

CLI and Vite Plugin to auto-generate atomic utility CSS from your CSS design tokens (custom properties).

Only building the utility classes you're actually using 🎉🎉🎉

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
