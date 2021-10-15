import React from 'react'
import { getRandomInt } from '../../lib/utils/helpers'
import { MAX_PAYNOTE_SEED } from '../../components/Article/PayNote'
import withDefaultSSR from '../../lib/hocs/withDefaultSSR'
import ArticlePage from '../../components/Article/Page'

const PreviewArticlePage = props => <ArticlePage {...props} isPreview />

PreviewArticlePage.getInitialProps = () => {
  return {
    payNoteTryOrBuy: Math.random(),
    payNoteSeed: getRandomInt(MAX_PAYNOTE_SEED)
  }
}

export default withDefaultSSR(PreviewArticlePage)
