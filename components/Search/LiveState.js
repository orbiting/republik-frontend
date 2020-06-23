import React from 'react'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import { Interaction, linkRule, colors } from '@project-r/styleguide'
import { Link } from '../../lib/routes'
import { countFormat } from '../../lib/utils/format'

const ResultCount = compose(withT)(
  ({
    t,
    formValue,
    searchQuery,
    getSearchParams,
    dataAggregations,
    onClickSearchResults
  }) => {
    const totalCount =
      dataAggregations.search && dataAggregations.search.totalCount
    const results = t.pluralize('search/pageInfo/total', {
      count: countFormat(totalCount)
    })

    return (
      <Interaction.P style={{ marginBottom: 20 }}>
        {formValue === searchQuery && !dataAggregations.loading ? (
          totalCount ? (
            <Link
              route='search'
              params={getSearchParams({ q: searchQuery })}
              passHref
            >
              <a
                {...linkRule}
                onClick={() => {
                  if (onClickSearchResults) {
                    onClickSearchResults()
                  }
                }}
              >
                {results}
              </a>
            </Link>
          ) : (
            <span style={{ color: colors.lightText }}>{results}</span>
          )
        ) : (
          <>&nbsp;</>
        )}
      </Interaction.P>
    )
  }
)

export default ResultCount
