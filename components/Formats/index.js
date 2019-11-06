import React from 'react'
import { css } from 'glamor'

import GroupedFormats from './GroupedFormats'

import { Center, mediaQueries } from '@project-r/styleguide'

const styles = {
  container: css({
    padding: '30px 15px 120px',
    [mediaQueries.mUp]: {
      maxWidth: '695px',
      padding: '60px 0 120px'
    }
  })
}

const Formats = () => (
  <Center {...styles.container}>
    <GroupedFormats />
  </Center>
)
export default Formats
