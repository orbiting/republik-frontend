const { ANALYZE, NODE_ENV, CDN_FRONTEND_BASE_URL } = process.env

module.exports = {
  webpack: (config, { dev }) => {
    if (ANALYZE) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: 8888,
        openAnalyzer: true
      }))
    }

    const entryFactory = config.entry
    config.entry = () => (
      entryFactory()
        .then((entry) => {
          entry['main.js'] = [
            './lib/polyfill.js'
          ].concat(entry['main.js'])
          return entry
        })
    )
    return config
  },
  assetPrefix: NODE_ENV === 'production' && CDN_FRONTEND_BASE_URL
    ? CDN_FRONTEND_BASE_URL
    : '',
  useFileSystemPublicRoutes: false,
  onDemandEntries: {
    // wait 5 minutes before disposing entries
    // maxInactiveAge: 1000 * 60 * 5
  }
}
