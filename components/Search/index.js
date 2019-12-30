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
import { withResults, withAggregations } from './enhancers'
import ZeroResults from './ZeroResults'

import track from '../../lib/piwik'

import { DEFAULT_FILTER, SUPPORTED_FILTERS, isSameFilter } from './constants'

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

const findAggregation = (aggregations, filter) => {
  const agg = aggregations.find(d => d.key === filter.key)
  return !agg || !agg.buckets
    ? agg
    : agg.buckets.find(d => d.value === filter.value)
}

const hasResults = (aggregations, filter) =>
  !!findAggregation(aggregations, filter).count

const findFilterWithResults = aggregations =>
  SUPPORTED_FILTERS.find(filter => hasResults(aggregations, filter)) ||
  DEFAULT_FILTER

export default compose(
  withSearchRouter,
  withAggregations,
  withResults
)(
  ({
    cleanupUrl,
    urlQuery = '',
    urlFilter,
    updateUrlFilter,
    startState,
    data: { search } = {},
    dataAggregations
  }) => {
    useEffect(() => {
      cleanupUrl()
    }, [])

    // calc outside of effect to ensure it only runs when changing
    const keyword = urlQuery.toLowerCase()
    const category = `${urlFilter.key}:${urlFilter.value}`
    const searchCount = search && search.totalCount
    const aggCount =
      dataAggregations &&
      dataAggregations.search &&
      dataAggregations.search.totalCount

    useEffect(() => {
      if (searchCount !== undefined && !startState) {
        track(['trackSiteSearch', keyword, category, searchCount])
      }
    }, [startState, keyword, category, searchCount])

    // switch to first tab with results
    useEffect(() => {
      if (!dataAggregations || dataAggregations.loading) {
        return
      }
      const { aggregations } = dataAggregations.search
      const currentAgg = findAggregation(aggregations, urlFilter)
      if (currentAgg && currentAgg.count) {
        return
      }
      const newFilter = findFilterWithResults(aggregations)
      if (newFilter && !isSameFilter(newFilter, urlFilter)) {
        updateUrlFilter(newFilter)
      }
    }, [dataAggregations, urlFilter])

    return (
      <Center {...styles.container}>
        <Form />
        {startState ? (
          <CheatSheet />
        ) : (
          <>
            <Filters />
            {searchCount === 0 && aggCount === 0 ? (
              <ZeroResults />
            ) : (
              <>
                {searchCount > 0 && <Sort />}
                <Results />
              </>
            )}
          </>
        )}
      </Center>
    )
  }
)
