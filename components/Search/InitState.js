import React from 'react'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import {
  Interaction,
  linkRule,
  colors,
  fontStyles,
  mediaQueries,
  RawHtml
} from '@project-r/styleguide'
import Link from 'next/link'
import { css } from 'glamor'

const styles = {
  cheatsheetH3: css({
    ...fontStyles.sansSerifMedium14,
    ...fontStyles.sansSerifMedium14,
    margin: '30px 0 8px'
  }),
  cheatsheetP: css({
    ...fontStyles.sansSerifRegular14,
    lineHeight: 1.2,
    paddingBottom: 15,
    '& a': linkRule,
    [mediaQueries.mUp]: {
      paddingBottom: 40
    }
  })
}

const CheatSheet = compose(withT)(({ t }) => (
  <>
    <Interaction.H3 {...styles.cheatsheetH3}>
      {t('search/docs/title')}
    </Interaction.H3>
    <Interaction.P {...styles.cheatsheetP}>
      <RawHtml
        dangerouslySetInnerHTML={{
          __html: t('search/docs/text')
        }}
      />
    </Interaction.P>
  </>
))

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
              __html: !query || !query.length ? '&nbsp;' : results
            }}
          />
        </span>
      ) : (
        <ResultLink query={query} text={results} />
      )}
    </Interaction.P>
  )
})

export default ({ query, dataAggregations }) => (
  <div>
    <ResultCount query={query} dataAggregations={dataAggregations} />
    <CheatSheet />
  </div>
)
