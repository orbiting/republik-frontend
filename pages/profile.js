import React from 'react'
import { compose } from 'react-apollo'
import Frame from '../components/Frame'
import Profile from '../components/Profile'
import withData from '../lib/apollo/withData'
import withMe from '../lib/apollo/withMe'
import withT from '../lib/withT'

const Index = ({ url, me, t }) => {
  return (
    <Frame url={url}>
      <Profile slug={url.query.slug} />
    </Frame>
  )
}

export default compose(
  withData,
  withMe,
  withT
)(Index)
