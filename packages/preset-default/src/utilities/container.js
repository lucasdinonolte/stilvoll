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
          ],
        }),
      },
    },
  },
});
