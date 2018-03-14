import React from 'react'
import { compose } from 'react-apollo'
import Frame from '../components/Frame'
import Front from '../components/Front'
import Marketing from '../components/Marketing'
import withData from '../lib/apollo/withData'
import withT from '../lib/withT'
import withMembership from '../components/Auth/withMembership'

import {
  SALES_UP,
  CROWDFUNDING_NAME,
  PUBLIC_BASE_URL,
  CDN_FRONTEND_BASE_URL
} from '../lib/constants'

const PLEDGE_CROWDFUNDING_NAME = SALES_UP || CROWDFUNDING_NAME

const IndexPage = ({ url, t, isAuthorized, headers }) => {
  if (isAuthorized) {
    // does it's own meta
    return <Front url={url} headers={headers} />
  }
  const meta = {
    pageTitle: t('pages/index/pageTitle'),
    title: t('pages/index/title'),
    description: t('pages/index/description'),
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`,
    url: `${PUBLIC_BASE_URL}/`
  }
  return (
    <Frame
      raw
      url={url}
      meta={meta}
    >
      <Marketing crowdfundingName={PLEDGE_CROWDFUNDING_NAME} />
    </Frame>
  )
}

export default compose(
  withData,
  withMembership,
  withT
)(IndexPage)
