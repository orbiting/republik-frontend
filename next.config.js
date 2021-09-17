const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const { NODE_ENV, CDN_FRONTEND_BASE_URL } = process.env

module.exports = withBundleAnalyzer({
  webpack5: true,
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

    // avoid «Automatic publicPath is not supported in this browser» exception in IE11
    // https://github.com/webpack/webpack/blob/4837c3ddb9da8e676c73d97460e19689dd9d4691/lib/runtime/AutoPublicPathRuntimeModule.js#L58
    if (
      !config.output.publicPath &&
      CDN_FRONTEND_BASE_URL &&
      NODE_ENV === 'production'
    ) {
      config.output.publicPath = `${CDN_FRONTEND_BASE_URL}/_next/static/chunks/`
    }
    return config
  },
  poweredByHeader: false,
  assetPrefix:
    NODE_ENV === 'production' && CDN_FRONTEND_BASE_URL
      ? CDN_FRONTEND_BASE_URL
      : '',
  useFileSystemPublicRoutes: true,
  // , onDemandEntries: {
  //   // wait 5 minutes before disposing entries
  //   maxInactiveAge: 1000 * 60 * 5
  // }
  eslint: {
    ignoreDuringBuilds: true
  }
})
