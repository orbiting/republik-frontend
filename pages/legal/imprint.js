import React from 'react'
import Frame from '../../components/Frame'
import Page from '../../components/Imprint/Page'

export default () => {
  const meta = {
    title: 'Impressum',
    description: ''
  }
  return (
    <Frame meta={meta}>
      <Page />
    </Frame>
  )
}
