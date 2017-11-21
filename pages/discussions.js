import React from 'react'
import {compose} from 'redux'
import Frame from '../components/Frame'
import DiscussionIndex from '../components/Discussion/DiscussionIndex'
import withData from '../lib/apollo/withData'

const DiscussionPage = ({ url }) => (
  <Frame url={url}>
    <DiscussionIndex />
  </Frame>
)

export default compose(withData)(DiscussionPage)
