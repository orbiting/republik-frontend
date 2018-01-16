import React from 'react'
import { compose } from 'react-apollo'
import Frame from '../components/Frame'
import Discussion from '../components/Discussion/Discussion'
import DiscussionIndex from '../components/Discussion/DiscussionIndex'
import withData from '../lib/apollo/withData'

const DiscussionPage = ({ url }) => (
  <Frame url={url}>
    {url.query.id
      ? <Discussion discussionId={url.query.id} focusId={url.query.focus} />
      : <DiscussionIndex />}
  </Frame>
)

export default compose(withData)(DiscussionPage)
