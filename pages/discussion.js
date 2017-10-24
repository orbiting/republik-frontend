import React from 'react'
import {compose} from 'redux'
import Frame from '../components/Frame'
import Nav from '../components/Nav'
import Discussion from '../components/Discussion/Discussion'
import withData from '../lib/apollo/withData'

const DiscussionPage = ({ url }) => (
  <Frame url={url} nav={<Nav route='discussion' url={url} />}>
    <Discussion discussionId={url.query.id} />
  </Frame>
)

export default compose(withData)(DiscussionPage)
