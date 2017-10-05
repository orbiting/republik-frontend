import React from 'react'
import {compose} from 'redux'

import withData from '../lib/apollo/withData'
import withMe from '../lib/apollo/withMe'

import Frame from '../components/Frame'
import Front from '../components/Front'
import Nav from '../components/Nav'
import Marketing from '../components/Marketing'

const IndexPage = ({ url, me }) => (
  <Frame url={url} nav={<Nav route='/' url={url} />}>
    {me ? <Front /> : <Marketing />}
  </Frame>
)

export default compose(
  withData,
  withMe
)(IndexPage)
