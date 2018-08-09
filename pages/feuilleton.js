import React from 'react'
import { compose } from 'react-apollo'
import Front from '../components/Front'
import { enforceMembership } from '../components/Auth/withMembership'
import withData from '../lib/apollo/withData'
import withMe from '../lib/apollo/withMe'
import withT from '../lib/withT'

import { CDN_FRONTEND_BASE_URL } from '../lib/constants'

const FeuilletonPage = ({ url, me, t, headers }) => {
  const meta = {
    title: t('pages/feed/title'),
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`
  }
  return (
    <Front url={url} headers={headers} meta={meta} path={'/feuilleton'} />
  )
}

export default compose(
  withData,
  enforceMembership,
  withMe,
  withT
)(FeuilletonPage)
