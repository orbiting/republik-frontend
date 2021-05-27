import React from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'

import Frame from '../components/Frame'
import Front from '../components/Front'
import Marketing from '../components/Marketing'
import withT from '../lib/withT'
import withMembership from '../components/Auth/withMembership'

import { PUBLIC_BASE_URL, CDN_FRONTEND_BASE_URL } from '../lib/constants'
import { useInNativeApp } from '../lib/withInNativeApp'

import SignInPage from './anmelden'

const IndexPage = ({ t, isMember, router }) => {
  const { inNativeApp } = useInNativeApp()
  if (
    router.query.stale !== 'marketing' &&
    (isMember || router.query.extractId)
  ) {
    // does its own meta
    return <Front hasOverviewNav extractId={router.query.extractId} finite />
  }

  if (inNativeApp) {
    return <SignInPage />
  }

  const meta = {
    pageTitle: t('pages/index/pageTitle'),
    title: t('pages/index/title'),
    description: t('pages/index/description'),
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`,
    url: `${PUBLIC_BASE_URL}/`
  }
  return (
    <Frame raw meta={meta} isOnMarketingPage={true}>
      <Marketing />
    </Frame>
  )
}

const EnhancedPage = compose(withMembership, withT, withRouter)(IndexPage)

export default EnhancedPage
