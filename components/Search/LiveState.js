import React from 'react'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import { Interaction, linkRule, colors, RawHtml } from '@project-r/styleguide'
import Link from 'next/link'

const ResultLink = ({ searchQuery, children }) => (
  <Link
    href={{
      pathname: '/suche',
      query: { q: searchQuery }
    }}
    passHref
  >
    <a {...linkRule}>{children}</a>
  </Link>
)

const ResultCount = compose(withT)(
  ({ t, formValue, searchQuery, dataAggregations }) => {
    const totalCount =
      dataAggregations.search && dataAggregations.search.totalCount
    const results = t.pluralize('search/pageInfo/total', {
      count: totalCount
    })

    return (
      <Interaction.P>
        {formValue === searchQuery && !dataAggregations.loading ? (
          totalCount ? (
            <ResultLink searchQuery={searchQuery}>{results}</ResultLink>
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

export default ({ formValue, searchQuery, dataAggregations }) => (
  <div>
    <ResultCount
      formValue={formValue}
      searchQuery={searchQuery}
      dataAggregations={dataAggregations}
    />
    <br />
  </div>
)
