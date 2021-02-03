import React from 'react'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import { Interaction, A, useColorContext } from '@project-r/styleguide'
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
    const [colorScheme] = useColorContext()
    return (
      <Interaction.P style={{ marginBottom: 20 }}>
        {formValue === searchQuery && !dataAggregations.loading ? (
          totalCount ? (
            <Link
              route='search'
              params={getSearchParams({ q: searchQuery })}
              passHref
            >
              <A
                onClick={() => {
                  if (onClickSearchResults) {
                    onClickSearchResults()
                  }
                }}
              >
                {results}
              </A>
            </Link>
          ) : (
            <span {...colorScheme.set('color', 'textSoft')}>{results}</span>
          )
        ) : (
          <>&nbsp;</>
        )}
      </Interaction.P>
    )
  }
)

export default ResultCount
