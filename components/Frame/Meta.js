import React from 'react'
import Head from 'next/head'

import { imageSizeInfo, imageResizeUrl } from 'mdast-react-render/lib/utils'

export default ({ data, data: { url, image } }) => {
  const title = data.pageTitle || `${data.title} – Republik`

  const facebookImage = data.facebookImage || image
  const twitterImage = data.twitterImage || image

  const fbSizeInfo = facebookImage && imageSizeInfo(facebookImage)

  return (
    <Head>
      <title>{title}</title>
      <meta name='description' content={data.description} />

      <meta property='og:type' content='website' />
      {url && <meta property='og:url' content={url} />}
      {url && <link rel='canonical' href={url} />}
      <meta property='og:title' content={data.facebookTitle || data.title} />
      <meta
        property='og:description'
        content={data.facebookDescription || data.description}
      />
      {!!facebookImage && <meta property='og:image' content={facebookImage} />}
      {!!fbSizeInfo && (
        <meta property='og:image:width' content={fbSizeInfo.width} />
      )}
      {!!fbSizeInfo && (
        <meta property='og:image:height' content={fbSizeInfo.height} />
      )}

      <meta
        name='twitter:card'
        content={twitterImage ? 'summary_large_image' : 'summary'}
      />
      <meta name='twitter:site' content='@RepublikMagazin' />
      <meta name='twitter:creator' content='@RepublikMagazin' />
      <meta name='twitter:title' content={data.twitterTitle || data.title} />
      <meta
        name='twitter:description'
        content={data.twitterDescription || data.description}
      />
      {!!twitterImage && (
        <meta
          name='twitter:image:src'
          content={imageResizeUrl(twitterImage, '3000x')}
        />
      )}
    </Head>
  )
}
