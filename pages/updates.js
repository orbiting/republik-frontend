import React from 'react'
import withData from '../lib/apollo/withData'
import Frame from '../components/Frame'

import List from '../components/Updates/List'

export default withData(({url, serverContext}) => (
  <Frame url={url} raw>
    <List url={url} serverContext={serverContext} />
  </Frame>
))
