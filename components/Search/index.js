import React, { useEffect } from 'react'
import { css } from 'glamor'

import Form from './Form'
import Filters from './Filters'
import Sort from './Sort'
import Results from './Results'
import CheatSheet from './CheatSheet'

import { Center, mediaQueries } from '@project-r/styleguide'
import withSearchRouter from './withSearchRouter'

const styles = {
  container: css({
    paddingRight: 15,
    paddingLeft: 15,
    [mediaQueries.mUp]: {
      paddingRight: 0,
      paddingLeft: 0
    }
  })
}

export default withSearchRouter(({ cleanupUrl, empty }) => {
  useEffect(() => {
    cleanupUrl()
  }, [])

  return (
    <Center {...styles.container}>
      <Form />
      {empty ? (
        <CheatSheet />
      ) : (
        <>
          <Filters />
          <Sort />
          <Results />
        </>
      )}
    </Center>
  )
})
