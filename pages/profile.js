import React from 'react'
import { compose } from 'react-apollo'
import Frame from '../components/Frame'
import Profile from '../components/Profile'
import withMembership from '../components/Auth/withMembership'
import withData from '../lib/apollo/withData'
import withMe from '../lib/apollo/withMe'
import withT from '../lib/withT'

const Index = ({ url, me, t }) => {
  return (
    <Frame url={url}>
      <Profile userId={url.query.userId} />
    </Frame>
  )
}

export default compose(
  withData,
  withMembership,
  withMe,
  withT
)(Index)
