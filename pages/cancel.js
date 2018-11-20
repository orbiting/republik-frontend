import React from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'
import Frame from '../components/Frame'
import Cancel from '../components/Account/Memberships/Cancel'
import withT from '../lib/withT'

const CancelMembershipPage = ({ router, t }) => {
  const meta = {
    title: t('pages/account/cancel/title')
  }
  const membershipId = router.query.membershipId
  return (
    <Frame meta={meta} raw>
      <Cancel membershipId={membershipId} />
    </Frame>
  )
}

export default compose(
  withT,
  withRouter
)(CancelMembershipPage)
