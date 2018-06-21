import React from 'react'
import { compose } from 'react-apollo'
import Frame from '../components/Frame'
import Search from '../components/Search'
import { enforceMembership } from '../components/Auth/withMembership'
import withData from '../lib/apollo/withData'
import withMe from '../lib/apollo/withMe'
import withT from '../lib/withT'

import { CDN_FRONTEND_BASE_URL } from '../lib/constants'

const SearchPage = ({ url, me, t }) => {
  const meta = {
    title: t('pages/search/title'),
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`
  }
  return (
    <Frame raw url={url} meta={meta}>
      <Search url={url} />
    </Frame>
  )
}

export default compose(
  withData,
  enforceMembership,
  withMe,
  withT
)(SearchPage)
