import React from 'react'
import {compose} from 'redux'
import Frame from '../components/Frame'
import Nav from '../components/Nav'
import Discussion from '../components/Discussion'
import Marketing from '../components/Marketing'
import withData from '../lib/apollo/withData'
import withMe from '../lib/apollo/withMe'

const DiscussionPage = ({ url, me }) => (
  <Frame url={url} nav={<Nav route='discussion' url={url} />}>
    {me ? <Discussion /> : <Marketing />}
  </Frame>
)

export default compose(
  withData,
  withMe
)(DiscussionPage)
