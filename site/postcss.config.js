module.exports = {
  plugins: {
    'postcss-custom-media': {
      importFrom: 'src/components/ThemeContext/custom-media.css'
    },
    '@tailwindcss/postcss': {},
    autoprefixer: {}
  }
}
