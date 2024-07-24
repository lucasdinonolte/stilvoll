export default {
  input: ['./src/input.css'],
  output: './dist/utils.css',
  entries: ['./src/pages/**/*.html'],
  typeDefinitions: false,
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
};
