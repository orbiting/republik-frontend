import React from 'react'
import { compose } from 'react-apollo'
import Frame from '../components/Frame'
import Front from '../components/Front'
import Marketing from '../components/Marketing'
import withData from '../lib/apollo/withData'
import withInNativeApp from '../lib/withInNativeApp'
import withT from '../lib/withT'
import withMembership, { UnauthorizedPage } from '../components/Auth/withMembership'

import {
  PUBLIC_BASE_URL,
  CDN_FRONTEND_BASE_URL
} from '../lib/constants'

const IndexPage = ({ url, t, me, isMember, inNativeIOSApp }) => {
  if (isMember) {
    // does it's own meta
    return <Front url={url} />
  }
  if (inNativeIOSApp) {
    return <UnauthorizedPage me={me} url={url} />
  }
  const meta = {
    pageTitle: t('pages/index/pageTitle'),
    title: t('pages/index/title'),
    description: t('pages/index/description'),
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`,
    url: `${PUBLIC_BASE_URL}/`
  }
  return (
    <Frame raw url={url} meta={meta}>
      <Marketing />
    </Frame>
  )
}

export default compose(
  withData,
  withMembership,
  withInNativeApp,
  withT
)(IndexPage)
