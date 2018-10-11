import React from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'
import Preview from '../components/Marketing/Preview'
import withInNativeApp from '../lib/withInNativeApp'
import withT from '../lib/withT'
import withMembership, { UnauthorizedPage } from '../components/Auth/withMembership'

import {
  PUBLIC_BASE_URL,
  CDN_FRONTEND_BASE_URL
} from '../lib/constants'

const PreviewPage = ({ router, t, me, isMember, inNativeIOSApp }) => {
  if (inNativeIOSApp) {
    return <UnauthorizedPage me={me} />
  }
  const meta = {
    pageTitle: t('marketing/preview/page/pageTitle'),
    title: t('marketing/preview/page/title'),
    description: t('marketing/preview/page/description'),
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`,
    url: `${PUBLIC_BASE_URL}${router.pathname}`
  }
  return (
    <Preview meta={meta} />
  )
}

export default compose(
  withMembership,
  withInNativeApp,
  withT,
  withRouter
)(PreviewPage)
