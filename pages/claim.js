import React from 'react'
import withData from '../lib/apollo/withData'
import Frame from '../components/Frame'
import ClaimMembership from '../components/Account/Memberships/Claim'

export default withData(() => (
  <Frame>
    <ClaimMembership />
  </Frame>
))
