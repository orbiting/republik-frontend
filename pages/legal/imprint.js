import React from 'react'
import withData from '../../lib/apollo/withData'
import Frame from '../../components/Frame'
import Page from '../../components/Imprint/Page'

export default withData(({ url, serverContext }) => {
  const meta = {
    title: 'Impressum',
    description: ''
  }
  return (
    <Frame url={url} meta={meta}>
      <Page url={url} serverContext={serverContext} />
    </Frame>
  )
})
