import React from 'react'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import { Interaction, linkRule, colors, RawHtml } from '@project-r/styleguide'
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
      {!totalCount || !query || !query.length ? (
        <span style={{ color: colors.lightText }}>
          <RawHtml
            dangerouslySetInnerHTML={{
              __html: results
            }}
          />
        </span>
      ) : (
        <ResultLink query={query} text={results} />
      )}
    </Interaction.P>
  )
})

export default ({ query, urlQuery, dataAggregations }) => (
  <div>
    <ResultCount query={query} dataAggregations={dataAggregations} />
    <br />
  </div>
)
