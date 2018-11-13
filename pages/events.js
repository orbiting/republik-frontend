import React from 'react'
import Frame from '../components/Frame'

import List from '../components/Events/List'

export default ({ serverContext }) => (
  <Frame raw>
    <List serverContext={serverContext} />
  </Frame>
)
