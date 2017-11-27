import React from 'react'
import Head from 'next/head'

export default ({data, data: {image}}) => {
  const title = data.pageTitle || `${data.title} – Republik`

  const facebookImage = data.facebookImage || image
  const twitterImage = data.twitterImage || image

  return (
    <Head>
      <title>{title}</title>
      <meta name='description' content={data.description} />

      <meta property='og:type' content='website' />
      <meta property='og:url' content={data.url} />
      <meta property='og:title' content={data.facebookTitle || data.title} />
      <meta property='og:description' content={data.facebookDescription || data.description} />
      {!!facebookImage && <meta property='og:image' content={facebookImage} />}

      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:card' content={twitterImage ? 'summary_large_image' : 'summary'} />
      <meta name='twitter:site' content='@RepublikMagazin' />
      <meta name='twitter:creator' content='@RepublikMagazin' />
      <meta name='twitter:title' content={data.twitterTitle || data.title} />
      <meta name='twitter:description' content={data.twitterDescription || data.description} />
      {!!twitterImage && <meta name='twitter:image:src' content={twitterImage} />}
    </Head>
  )
}
