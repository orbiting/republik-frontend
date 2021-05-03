import React from 'react'
import Frame from '../components/Frame'

import List from '../components/Events/List'

const Page = ({ serverContext }) => (
  <Frame raw>
    <List serverContext={serverContext} />
  </Frame>
)

export default Page
