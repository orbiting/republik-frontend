import React from 'react'
import {css} from 'glamor'
import Head from 'next/head'

import {
  NarrowContainer, Logo, mediaQueries, fontStyles
} from '@project-r/styleguide'

import PureFooter, {SPACE} from '../components/Frame/PureFooter'

import {
  PUBLIC_BASE_URL, CURTAIN_MESSAGE
} from '../lib/constants'

const styles = {
  container: css({
    backgroundColor: '#000',
    color: '#fff',
    minHeight: '100vh'
  }),
  logoContainer: css({
    textAlign: 'center',
    paddingTop: 25,
    width: 200,
    marginLeft: 'auto',
    marginRight: 'auto',
    [mediaQueries.mUp]: {
      width: 280,
      paddingTop: SPACE * 2
    }
  }),
  whiteOnBlack: css({
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
    '& ::selection': {
      color: '#000',
      backgroundColor: '#fff'
    }
  }),
  message: css({
    color: '#fff',
    margin: '200px 0',
    textAlign: 'center',
    ...fontStyles.sansSerifRegular21,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular21
    }
  })
}

export default ({url}) => {
  const meta = {
    title: 'Republik',
    description: CURTAIN_MESSAGE,
    image: `${PUBLIC_BASE_URL}/static/social-media/logo.png`,
    url: `${PUBLIC_BASE_URL}${url.pathname}`
  }

  return (
    <div {...styles.container}>
      <Head>
        <title>Republik</title>
        <meta name='description' content={meta.description} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={meta.url} />
        <meta property='og:title' content={meta.title} />
        <meta property='og:description' content={meta.description} />
        <meta property='og:image' content={meta.image} />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@RepublikMagazin' />
        <meta name='twitter:creator' content='@RepublikMagazin' />
      </Head>
      <NarrowContainer>
        <div {...styles.whiteOnBlack}>
          <div {...styles.logoContainer}>
            <Logo fill='#fff' />
          </div>

          <div {...styles.message}>
            {CURTAIN_MESSAGE}
          </div>

          <PureFooter inverted url={url} />
        </div>
      </NarrowContainer>
    </div>
  )
}
