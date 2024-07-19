export default {
  input: ['./fixtures/input.css'],
  output: './fixtures/dist/utils.css',
  entries: [
    './fixtures/pages/**/*.html',
  ],
  classNameMap: './fixtures/dist/utils.js',
};
