import React from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'
import Frame from '../components/Frame'
import Discussion from '../components/Discussion/Discussion'
import DiscussionIndex from '../components/Discussion/DiscussionIndex'
import withData from '../lib/apollo/withData'

const DiscussionPage = ({ router: { query } }) => (
  <Frame>
    {query.id
      ? <Discussion
        discussionId={query.id}
        focusId={query.focus}
        mute={!!query.mute} />
      : <DiscussionIndex />}
  </Frame>
)

export default compose(withData, withRouter)(DiscussionPage)
