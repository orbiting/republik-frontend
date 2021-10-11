import React from 'react'
import { Meta } from '@project-r/styleguide'

import Frame from '../components/Frame'

const StaticIndex = () => {
  return (
    <Frame
      meta={{
        title: 'Static Index'
      }}
    >
      <Meta.Headline>Static</Meta.Headline>
    </Frame>
  )
}

export default StaticIndex

export async function getStaticProps(context) {
  return {
    props: {} // will be passed to the page component as props
  }
}
