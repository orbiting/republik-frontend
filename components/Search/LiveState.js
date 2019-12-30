import React from 'react'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import { Interaction, linkRule, colors, RawHtml } from '@project-r/styleguide'
import { Link } from '../../lib/routes'

const ResultCount = compose(withT)(
  ({ t, formValue, searchQuery, getSearchParams, dataAggregations }) => {
    const totalCount =
      dataAggregations.search && dataAggregations.search.totalCount
    const results = t.pluralize('search/pageInfo/total', {
      count: totalCount
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
              <a {...linkRule}>{results}</a>
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
