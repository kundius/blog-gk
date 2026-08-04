module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-custom-media': {
      importFrom: 'src/components/ThemeContext/custom-media.css'
    },
  }
  // plugins: [
  //   reuqire('tailwindcss'),
  //   reuqire('autoprefixer'),
  //   reuqire('postcss-custom-media')({
  //     importFrom: 'src/components/ThemeContext/custom-media.css'
  //   })
  // ]
}
