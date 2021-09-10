import React from 'react'
import { flowRight as compose } from 'lodash'
import { withRouter } from 'next/router'
import Frame from '../components/Frame'
import Search from '../components/Search'
import { enforceMembership } from '../components/Auth/withMembership'
import withT from '../lib/withT'

import { CDN_FRONTEND_BASE_URL } from '../lib/constants'

const SearchPage = ({ router, t }) => {
  const meta = {
    title: t('pages/search/title'),
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`
  }
  return (
    <Frame raw meta={meta}>
      <Search query={router.query} />
    </Frame>
  )
}

export default compose(enforceMembership(), withT, withRouter)(SearchPage)
