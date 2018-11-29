import React from 'react'
import { compose } from 'react-apollo'
import Frame from '../components/Frame'
import Front from '../components/Front'
import Marketing from '../components/Marketing/Feuilleton'
import withInNativeApp from '../lib/withInNativeApp'
import withT from '../lib/withT'
import withMembership, { UnauthorizedPage } from '../components/Auth/withMembership'

import {
  PUBLIC_BASE_URL,
  CDN_FRONTEND_BASE_URL
} from '../lib/constants'

const FeuilletonPage = ({ t, me, isMember, inNativeIOSApp }) => {
  if (isMember) {
    // does it's own meta
    return <Front />
  }
  if (inNativeIOSApp) {
    return <UnauthorizedPage me={me} />
  }
  const meta = {
    pageTitle: t('pages/feuilleton/pageTitle'),
    title: t('pages/feuilleton/title'),
    description: t('pages/feuilleton/description'),
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`,
    url: `${PUBLIC_BASE_URL}/`
  }
  return (
    <Frame raw meta={meta}>
      <Marketing />
    </Frame>
  )
}

export default compose(
  withMembership,
  withInNativeApp,
  withT
)(FeuilletonPage)
