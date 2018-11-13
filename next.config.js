const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')

const { BUNDLE_ANALYZE, NODE_ENV, CDN_FRONTEND_BASE_URL } = process.env

module.exports = withBundleAnalyzer({
  analyzeServer: ['server', 'both'].includes(BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../bundles/server.html'
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: './bundles/client.html'
    }
  },
  webpack: (config, { dev }) => {
    config.externals = config.externals || {}
    config.externals['lru-cache'] = 'lru-cache'
    config.externals['react-dom/server'] = 'react-dom/server'

    const entryFactory = config.entry
    const polyfillPath = './lib/polyfill.js'

    config.entry = async () => {
      const entries = await entryFactory()

      if (
        entries['main.js'] &&
        !entries['main.js'].includes(polyfillPath)
      ) {
        entries['main.js'].unshift(polyfillPath)
      }

      return entries
    }
    return config
  },
  poweredByHeader: false,
  assetPrefix: NODE_ENV === 'production' && CDN_FRONTEND_BASE_URL
    ? CDN_FRONTEND_BASE_URL
    : '',
  useFileSystemPublicRoutes: false
  // , onDemandEntries: {
  //   // wait 5 minutes before disposing entries
  //   maxInactiveAge: 1000 * 60 * 5
  // }
})
