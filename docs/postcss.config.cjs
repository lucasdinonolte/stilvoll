module.exports = {
  plugins: {
    /**
     * This is used to make the custom media queries available in all
     * CSS files, so postcss-custom-media, which is part of preset-env
     * can pick them up and use them.
     *
     * SEE: https://www.dropbox.com/scl/fi/byrugzs3ybe29s82stn7i/Problems-with-Custom-Media-and-Custom-Properties.paper?rlkey=a2fmuv430zfsqxjndygfr3yew&dl=0#:uid=901383138018970239987853&h2=Working-solution-(as-of-May-20
     */
    '@csstools/postcss-global-data': {
      files: ['./src/styles/breakpoints.css'],
    },
    'postcss-preset-env': {},
  },
};
