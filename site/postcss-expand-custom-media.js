const customMediaRe = /\((--[a-z0-9-]+)\)/g

module.exports = () => {
  return {
    postcssPlugin: 'postcss-expand-custom-media',
    Once(root) {
      const defs = new Map()
      root.walkAtRules('custom-media', (at) => {
        const idx = at.params.indexOf(' ')
        if (idx === -1) return
        defs.set(at.params.slice(0, idx).trim(), at.params.slice(idx + 1).trim())
        at.remove()
      })
      if (defs.size === 0) return
      root.walkAtRules('media', (at) => {
        at.params = at.params.replace(customMediaRe, (full, name) => {
          return defs.has(name) ? defs.get(name) : full
        })
      })
    },
  }
}
