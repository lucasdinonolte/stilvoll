export const grid = (settings) => ({
  utilities: {
    gutter: {
      customPropertyRegex: /^--space-/,
      utilities: {
        gutter: {
          properties: ['--grid-gutter'],
          explainer: 'Sets the grid gutter',
        },
      },
    },
  },
  staticUtilities: {
    row: ({ className }) => ({
      css: `.${className} {
  display: flex;
  flex-wrap: wrap;
  margin-right: calc(-0.5 * var(--grid-gutter, 0));
  margin-left: calc(-0.5 * var(--grid-gutter, 0));
}

.${className} > * {
  box-sizing: border-box;
  flex-shrink: 0;
  width: 100%;
  max-width: 100%;
  padding-right: calc(0.5 * var(--grid-gutter, 0));
  padding-left: calc(0.5 * var(--grid-gutter, 0));
}`,
    }),
    ...Array.from({ length: settings.columns }, (_, i) => i + 1).reduce(
      (acc, i) => ({
        ...acc,
        [`col-${i}`]: ({ className }) => ({
          css: `.${className} {
  flex: 0 0 auto;
  width: calc((100% / ${settings.columns}) * ${i});
}`,
        }),
      }),
      {},
    ),
    ...Array.from({ length: settings.columns }, (_, i) => i + 1).reduce(
      (acc, i) => ({
        ...acc,
        [`push-${i}`]: ({ className }) => ({
          css: `.${className} {
  margin-left: calc((100% / ${settings.columns}) * ${i});
}`,
        }),
      }),
      {},
    ),
  },
});
