import React from 'react'
import withData from '../lib/apollo/withData'
import Frame from '../components/Frame'

import List from '../components/Events/List'

export default withData(({url, serverContext}) => (
  <Frame url={url}>
    <List slug={url.query.slug} serverContext={serverContext} />
  </Frame>
))
