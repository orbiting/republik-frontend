import React from 'react'
import withData from '../../lib/apollo/withData'
import Frame from '../../components/Frame'
import Page from '../../components/Imprint/Page'

export default withData(({ serverContext }) => {
  const meta = {
    title: 'Impressum',
    description: ''
  }
  return (
    <Frame meta={meta}>
      <Page serverContext={serverContext} />
    </Frame>
  )
})
