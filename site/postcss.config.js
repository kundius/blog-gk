module.exports = {
  plugins: [
    require('@csstools/postcss-global-data')({
      files: ['src/components/ThemeContext/custom-media.css']
    }),
    require('postcss-nesting')(),
    require('./postcss-expand-custom-media.js')(),
    require('@tailwindcss/postcss')(),
    require('autoprefixer')()
  ]
}
