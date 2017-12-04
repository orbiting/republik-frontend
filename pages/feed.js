import React from 'react'
import { compose } from 'react-apollo'
import Frame from '../components/Frame'
import Feed from '../components/Feed'
import withMembership from '../components/Auth/withMembership'
import withData from '../lib/apollo/withData'
import withMe from '../lib/apollo/withMe'
import withT from '../lib/withT'

const FeedPage = ({ url, me, t }) => {
  const meta = {
    title: t('pages/feed/title')
  }
  return (
    <Frame raw url={url} meta={meta}>
      <Feed />
    </Frame>
  )
}

export default compose(
  withData,
  withMembership,
  withMe,
  withT
)(FeedPage)
