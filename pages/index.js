import React from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'

// import Frame from '../components/Frame'
import Front from '../components/Front'
// import Marketing from '../components/Marketing'
import withT from '../lib/withT'
import withMembership from '../components/Auth/withMembership'
import { getRandomReason } from '../components/Crowdfunding/reasonData'

// import { PUBLIC_BASE_URL, CDN_FRONTEND_BASE_URL } from '../lib/constants'

import CF2 from './crowdfunding2'

const IndexPage = ({ t, isMember, router, reason }) => {
  if (
    router.query.stale !== 'marketing' &&
    (isMember || router.query.extractId)
  ) {
    // does it's own meta
    return <Front extractId={router.query.extractId} finite />
  }
  // does it's own meta
  // ToDo: change url in CF2 once rm here
  return <CF2 reason={reason} />
  // const meta = {
  //   pageTitle: t('pages/index/pageTitle'),
  //   title: t('pages/index/title'),
  //   description: t('pages/index/description'),
  //   image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`,
  //   url: `${PUBLIC_BASE_URL}/`
  // }
  // return (
  //   <Frame raw meta={meta}>
  //     <Marketing />
  //   </Frame>
  // )
}

const EnhancedPage = compose(
  withMembership,
  withT,
  withRouter
)(IndexPage)

EnhancedPage.getInitialProps = () => {
  return {
    reason: getRandomReason()
  }
}

export default EnhancedPage
