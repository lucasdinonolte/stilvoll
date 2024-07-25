export const container = () => ({
  utilities: {
    container: {
      customPropertyRegex: /^--container-/,
      utilities: {
        container: ({ className, value }) => ({
          selector: `.${className}`,
          properties: [
            ['max-width', value],
            ['margin-right', 'auto'],
            ['margin-left', 'auto'],
            ['padding-right', 'var(--layout-margin, 0)'],
            ['padding-left', 'var(--layout-margin, 0)'],
          ],
        }),
        'container-left': ({ className, value }) => ({
          selector: `.${className}`,
          properties: [
            ['max-width', value],
            ['margin-right', 0],
            ['margin-left', 0],
            ['padding-right', 'var(--layout-margin, 0)'],
            ['padding-left', 'var(--layout-margin, 0)'],
          ],
        }),
      },
    },
  },
  customProperties: {
    '--container-sm': '540px',
    '--container-md': '720px',
    '--container-lg': '960px',
    '--container-xl': '1140px',
    '--layout-margin': '16px',
  },
});
