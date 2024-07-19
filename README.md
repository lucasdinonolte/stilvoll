# Token to Utility CSS

CLI and Vite Plugin to auto-generate atomic utility CSS from your CSS design tokens (custom properties).

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

## Features

- **css driven** no need to maintain your theme in a config file, you're css custom properties are the source of truth
- **on-demand** in build only the CSS classes you’re actually using a generated
- **typesafe** optionally build a classname map to get autocomplete on the utility classes in your editor
- **extensible** create your own atomic css classes by creating rules on how to create them from your custom properties
