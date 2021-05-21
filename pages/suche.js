import React from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'
import Frame from '../components/Frame'
import Search from '../components/Search'
import { enforceMembership } from '../components/Auth/withMembership'
import withMe from '../lib/apollo/withMe'
import withT from '../lib/withT'

import { CDN_FRONTEND_BASE_URL } from '../lib/constants'

const SearchPage = ({ router, me, t }) => {
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

export default compose(
  enforceMembership(),
  withMe,
  withT,
  withRouter
)(SearchPage)
