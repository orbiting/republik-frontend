import React from 'react'
import Head from 'next/head'

export default ({data, data: {image}}) => {
  const title = data.pageTitle || `${data.title} – Republik`

  return (
    <Head>
      <title>{title}</title>
      <meta name='description' content={data.description} />
      <meta property='og:type' content='website' />
      <meta property='og:url' content={data.url} />
      <meta property='og:title' content={data.title} />
      <meta property='og:description' content={data.description} />
      {!!image && <meta property='og:image' content={image} />}
      <meta name='twitter:card' content={image ? 'summary_large_image' : 'summary'} />
      <meta name='twitter:site' content='@RepublikMagazin' />
      <meta name='twitter:creator' content='@RepublikMagazin' />
    </Head>
  )
}
