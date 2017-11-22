import React from 'react'
import withData from '../lib/apollo/withData'
import Page from '../components/Article/Page'

import { PUBLIC_BASE_URL } from '../lib/constants'

const ArticlePage = ({ url, t }) => {
  const meta = {
    pageTitle: 'Demo',
    title: 'Demo',
    url: `${PUBLIC_BASE_URL}${url.pathname}`
  }

  return <Page url={url} meta={meta} />
}

export default withData(ArticlePage)
