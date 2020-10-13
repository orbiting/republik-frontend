import React from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'
import Frame from '../components/Frame'
import TestStripe from '../components/Pledge/TestStripe'
import withMe from '../lib/apollo/withMe'
import withT from '../lib/withT'

import { CDN_FRONTEND_BASE_URL } from '../lib/constants'

const TestPage = ({ router, me, t }) => {
  const meta = {
    title: 'stripe test',
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`
  }
  return (
    <Frame raw meta={meta}>
      <TestStripe />
    </Frame>
  )
}

export default compose(withMe, withT, withRouter)(TestPage)
