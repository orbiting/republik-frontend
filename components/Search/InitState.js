import React from 'react'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import { Interaction, linkRule } from '@project-r/styleguide'
import Link from 'next/link'

export default compose(withT)(({ t, query, dataAggregations }) => {
  const totalCount =
    dataAggregations.search && dataAggregations.search.totalCount
  const results = t.pluralize('search/pageInfo/total', {
    count: totalCount
  })

  return (
    <div>
      {query && (
        <Interaction.P>
          {totalCount ? (
            <Link
              href={{
                pathname: '/suche',
                query: { q: query }
              }}
              passHref
            >
              <a {...linkRule}>{results}</a>
            </Link>
          ) : (
            <span>{results}</span>
          )}
        </Interaction.P>
      )}
    </div>
  )
})
