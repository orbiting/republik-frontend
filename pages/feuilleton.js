import React from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'

import Frame from '../components/Frame'
import Front from '../components/Front'
import Marketing from '../components/Marketing/Feuilleton'
import withInNativeApp from '../lib/withInNativeApp'
import withT from '../lib/withT'
import withMembership, {
  UnauthorizedPage
} from '../components/Auth/withMembership'

import { PUBLIC_BASE_URL, CDN_FRONTEND_BASE_URL } from '../lib/constants'

const FeuilletonPage = props => {
  const { t, me, router, isMember, inNativeIOSApp } = props

  if (isMember) {
    // does it's own meta
    return <Front extractId={router.query.extractId} {...props} />
  }
  if (inNativeIOSApp) {
    return <UnauthorizedPage me={me} />
  }
  const meta = {
    pageTitle: t('pages/feuilleton/pageTitle'),
    title: t('pages/feuilleton/title'),
    description: t('pages/feuilleton/description'),
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/feuilleton.jpg`,
    url: `${PUBLIC_BASE_URL}/feuilleton`
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
  withRouter,
  withT
)(FeuilletonPage)
