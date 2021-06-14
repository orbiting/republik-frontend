import React from 'react'
import PropTypes from 'prop-types'
import withHeaders from '../../lib/withHeaders'

import { IconContextProvider } from '@project-r/styleguide/icons'

let getHtml
if (!process.browser) {
  const ReactDOMServer = require('react-dom/server')
  const cache = require('lru-cache')({
    max: 1000 * 1000 * 200, // 200mb
    length: d => d.length
  })
  const enabled = process.env.SSR_CACHE !== 'false'
  getHtml = (key, children) => {
    if (cache.has(key) && enabled) {
      return cache.get(key)
    }
    const html = ReactDOMServer.renderToStaticMarkup(
      <IconContextProvider value={{ style: { verticalAlign: 'middle' } }}>
        {children()}
      </IconContextProvider>
    )
    if (enabled) {
      cache.set(key, html)
    }
    return html
  }
}

const webpCacheKey = (headers, baseKey) => {
  if (!headers) {
    console.warn('[SSRCache] headers missing!')
  }
  return headers &&
    headers.accept &&
    headers.accept.indexOf('image/webp') !== -1
    ? `${baseKey}:webp`
    : baseKey
}

const SSRCachingBoundary = withHeaders(({ cacheKey, headers, children }) =>
  getHtml ? (
    <div
      dangerouslySetInnerHTML={{
        __html: getHtml(webpCacheKey(headers, cacheKey), children)
      }}
    />
  ) : (
    <div>{children()}</div>
  )
)

SSRCachingBoundary.propTypes = {
  cacheKey: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired
}

export default SSRCachingBoundary
