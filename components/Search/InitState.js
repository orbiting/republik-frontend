import React from 'react'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import { Interaction, linkRule, colors, RawHtml } from '@project-r/styleguide'
import Link from 'next/link'

const ResultLink = ({ searchQuery, text }) => (
  <Link
    href={{
      pathname: '/suche',
      query: { q: searchQuery }
    }}
    passHref
  >
    <a {...linkRule}>{text}</a>
  </Link>
)

const ResultCount = compose(withT)(({ t, searchQuery, dataAggregations }) => {
  const totalCount =
    dataAggregations.search && dataAggregations.search.totalCount
  const results = t.pluralize('search/pageInfo/total', {
    count: totalCount
  })

  return (
    <Interaction.P>
      {!totalCount || !searchQuery || !searchQuery.length ? (
        <span style={{ color: colors.lightText }}>
          <RawHtml
            dangerouslySetInnerHTML={{
              __html: results
            }}
          />
        </span>
      ) : (
        <ResultLink searchQuery={searchQuery} text={results} />
      )}
    </Interaction.P>
  )
})

export default ({ searchQuery, dataAggregations }) => (
  <div>
    <ResultCount
      searchQuery={searchQuery}
      dataAggregations={dataAggregations}
    />
    <br />
  </div>
)
