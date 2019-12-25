import React, { useEffect } from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'

import Form from './Form'
import Filters from './Filters'
import Sort from './Sort'
import Results from './Results'
import CheatSheet from './CheatSheet'

import { Center, mediaQueries } from '@project-r/styleguide'

import withSearchRouter from './withSearchRouter'
import { withResults } from './enhancers'
import ZeroResults from './ZeroResults'

import track from '../../lib/piwik'

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

export default compose(
  withSearchRouter,
  withResults
)(({ cleanupUrl, urlQuery = '', urlFilter, empty, data: { search } }) => {
  useEffect(() => {
    cleanupUrl()
  }, [])

  // calc outside of effect to ensure it only runs when changing
  const keyword = urlQuery.toLowerCase()
  const category = `${urlFilter.key}:${urlFilter.value}`
  const searchCount = search && search.totalCount

  useEffect(() => {
    if (searchCount !== undefined && !empty) {
      track(['trackSiteSearch', keyword, category, searchCount])
    }
  }, [empty, keyword, category, searchCount])

  return (
    <Center {...styles.container}>
      <Form />
      {empty ? (
        <CheatSheet />
      ) : (
        <>
          <Filters />
          {searchCount === 0 ? (
            <ZeroResults />
          ) : (
            <>
              <Sort />
              <Results />
            </>
          )}
        </>
      )}
    </Center>
  )
})
