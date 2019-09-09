import React from 'react'
import { withRouter } from 'next/router'
import Head from 'next/head'

import Frame from '../components/Frame'
import CardClaim from '../components/Card/Claim'
import CardUpdate from '../components/Card/Update'
import Meta from '../components/Frame/Meta'

import withT from '../lib/withT'

const Page = ({ router, t }) => {
  const { token } = router.query

  if (token) {
    return (
      <Frame>
        <Meta data={{
          title: t('pages/cardSetup/title'),
          description: t('pages/cardSetup/description')
        }} />
        <Head>
          <meta name='robots' content='noindex' />
        </Head>
        <CardClaim />
      </Frame>
    )
  }

  return (
    <Frame>
      <Meta data={{
        title: t('pages/cardSetup/title'),
        description: t('pages/cardSetup/description')
      }} />
      <Head>
        <meta name='robots' content='noindex' />
      </Head>
      <CardUpdate />
    </Frame>
  )
}

export default withRouter(withT(Page))
