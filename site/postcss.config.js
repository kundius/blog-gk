module.exports = {
  plugins: {
    '@csstools/postcss-global-data': {
      files: ['src/components/ThemeContext/custom-media.css']
    },
    'postcss-nesting': {},
    'postcss-custom-media': {},
    '@tailwindcss/postcss': {},
    autoprefixer: {}
  }
}
