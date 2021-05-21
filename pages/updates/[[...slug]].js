import React from 'react'
import Frame from '../../components/Frame'

import List from '../../components/Updates/List'

const UpdatesPage = ({ serverContext }) => (
  <Frame raw>
    <List serverContext={serverContext} />
  </Frame>
)

export default UpdatesPage
