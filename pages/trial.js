import React from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'

import Frame from '../components/Frame'
import Trial from '../components/Marketing/Trial'
import withT from '../lib/withT'
import {
  CDN_FRONTEND_BASE_URL,
  PUBLIC_BASE_URL
} from '../lib/constants'

const Page = ({ router, t }) => {
  const meta = {
    pageTitle: t('trial/meta/pageTitle'),
    title: t('trial/meta/title'),
    description: t('trial/meta/description'),
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`,
    url: `${PUBLIC_BASE_URL}${router.pathname}`
  }

  return (
    <Frame meta={meta}>
      <Trial />
    </Frame>
  )
}

export default compose(withRouter, withT)(Page)
