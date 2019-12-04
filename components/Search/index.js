import React from 'react'
import { css } from 'glamor'

import Form from './Form'
import Filters from './Filters'
import Sort from './Sort'
import Results from './Results'

import { Center, mediaQueries } from '@project-r/styleguide'

const styles = {
  container: css({
    padding: '15px 15px 120px',
    [mediaQueries.mUp]: {
      padding: '40px 0 120px'
    }
  })
}

export default () => (
  <Center {...styles.container}>
    <Form />
    <Filters />
    <Sort />
    <Results />
  </Center>
)
