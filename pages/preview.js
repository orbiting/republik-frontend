import React from 'react'
import { compose } from 'react-apollo'
import Preview from '../components/Marketing/Preview'
import withData from '../lib/apollo/withData'
import withInNativeApp from '../lib/withInNativeApp'
import withT from '../lib/withT'
import withMembership, { UnauthorizedPage } from '../components/Auth/withMembership'

import {
  PUBLIC_BASE_URL,
  CDN_FRONTEND_BASE_URL
} from '../lib/constants'

const IndexPage = ({ url, t, me, isMember, inNativeIOSApp }) => {
  if (inNativeIOSApp) {
    return <UnauthorizedPage me={me} url={url} />
  }
  const meta = {
    pageTitle: t('marketing/preview/page/pageTitle'),
    title: t('marketing/preview/page/title'),
    description: t('marketing/preview/page/description'),
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`,
    url: `${PUBLIC_BASE_URL}/`
  }
  return (
    <Preview url={url} meta={meta} />
  )
}

export default compose(
  withData,
  withMembership,
  withInNativeApp,
  withT
)(IndexPage)
