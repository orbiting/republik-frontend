import React from 'react'
import {compose} from 'redux'
import Frame from '../components/Frame'
import Nav from '../components/Nav'
import DiscussionIndex from '../components/Discussion/DiscussionIndex'
import withData from '../lib/apollo/withData'

const DiscussionPage = ({ url }) => (
  <Frame url={url} nav={<Nav route='discussions' url={url} />}>
    <DiscussionIndex />
  </Frame>
)

export default compose(withData)(DiscussionPage)
