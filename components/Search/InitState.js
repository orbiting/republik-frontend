import React from 'react'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import { Interaction, linkRule, colors } from '@project-r/styleguide'
import Link from 'next/link'

const ResultLink = ({ query, text }) => (
  <Link
    href={{
      pathname: '/suche',
      query: { q: query }
    }}
    passHref
  >
    <a {...linkRule}>{text}</a>
  </Link>
)

const ResultCount = compose(withT)(({ t, query, dataAggregations }) => {
  const totalCount =
    dataAggregations.search && dataAggregations.search.totalCount
  const results = t.pluralize('search/pageInfo/total', {
    count: totalCount
  })

  return (
    <Interaction.P>
      {totalCount ? (
        <ResultLink query={query} text={results} />
      ) : (
        <span style={{ color: colors.lightText }}>{results}</span>
      )}
    </Interaction.P>
  )
})

export default compose(withT)(({ t, query, dataAggregations }) => {
  return (
    <div>
      {query && query.length > 2 && (
        <ResultCount query={query} dataAggregations={dataAggregations} />
      )}
    </div>
  )
})
