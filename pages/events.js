import React from 'react'
import withData from '../lib/apollo/withData'
import Frame from '../components/Frame'

import List from '../components/Events/List'

export default withData(({serverContext}) => (
  <Frame raw>
    <List serverContext={serverContext} />
  </Frame>
))
