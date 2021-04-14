const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const { NODE_ENV, CDN_FRONTEND_BASE_URL } = process.env

module.exports = withBundleAnalyzer({
  future: {
    webpack5: true
  },
  webpack: config => {
    config.externals = config.externals || {}
    config.externals['lru-cache'] = 'lru-cache'
    config.externals['react-dom/server'] = 'react-dom/server'

    const alias = Object.assign({}, config.resolve.alias)
    delete alias.url
    config.resolve = {
      ...config.resolve,
      alias
    }
    return config
  },
  poweredByHeader: false,
  assetPrefix:
    NODE_ENV === 'production' && CDN_FRONTEND_BASE_URL
      ? CDN_FRONTEND_BASE_URL
      : '',
  useFileSystemPublicRoutes: false
  // , onDemandEntries: {
  //   // wait 5 minutes before disposing entries
  //   maxInactiveAge: 1000 * 60 * 5
  // }
})
