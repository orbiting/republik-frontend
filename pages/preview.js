import React from 'react'
import { compose } from 'react-apollo'
import Frame from '../components/Frame'
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
    pageTitle: 'Die Republik probelesen',
    title: 'Die Republik probelesen',
    description: 'Melden Sie sich an, um kostenlos fünf Artikel zu lesen.',
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`,
    url: `${PUBLIC_BASE_URL}/`
  }
  return (
    <Frame showSecondary={false} raw url={url} meta={meta}>
      <Preview url={url} />
    </Frame>
  )
}

export default compose(
  withData,
  withMembership,
  withInNativeApp,
  withT
)(IndexPage)
