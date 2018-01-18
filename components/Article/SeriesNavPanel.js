import React from 'react'

import { css } from 'glamor'
import { matchPath, Link, Router } from '../../lib/routes'
import { timeFormat } from '../../lib/utils/format'
import withT from '../../lib/withT'
import { negativeColors } from '../Frame/Footer'

import {
  Interaction,
  colors,
  fontStyles,
  mediaQueries
} from '@project-r/styleguide'

const dayFormat = timeFormat('%d. %B %Y')

const styles = {
  container: css({
    color: negativeColors.text
  }),
  base: css({
    cursor: 'default',
    display: 'block',
    padding: '10px 15px',
    textAlign: 'center',
    '& + &': {
      borderTop: `1px solid ${negativeColors.divider}`
    },
  }),
  link: css({
    textDecoration: 'none',
    color: negativeColors.text,
    ':visited': {
      color: negativeColors.text
    },
    ':hover': {
      color: negativeColors.primary
    },
    cursor: 'pointer'
  }),
  linkSelected: css({
    backgroundColor: '#fff',
    textDecoration: 'none',
    color: colors.text
  }),
  selected: css({
    backgroundColor: '#fff'
  }),
  unpublished: css({
    color: negativeColors.lightText
  }),
  title: css({
     ...fontStyles.serifTitle26,
    [mediaQueries.mUp]: {
      ...fontStyles.serifTitle38
    }
  }),
  date: css({
    ...fontStyles.sansSerifRegular15,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular21
    }
  }),
}

const Title = ({children}) => (
  <h2 {...styles.title}>{children}</h2>
)

const PublishDate = ({date}) => (
  <p {...styles.date}>{dayFormat(Date.parse(date))}</p>
)

const EpisodeLink = ({ episode, translation, params = {}, url }) => {
  const route = episode.document && episode.document.meta && episode.document.meta.path
  if (!route) {
    return (
      <div {...styles.base} {...styles.unpublished}>
        <Title>{episode.title}</Title>
        <PublishDate date={episode.publishDate} />
      </div>
    )
  }
  if (
    url.asPath &&
    url.asPath === route
  ) {
    return (
      <a
        {...styles.base}
        {...styles.linkSelected}
        style={{ cursor: 'pointer' }}
        onClick={e => {
          e.preventDefault()
          Router.replaceRoute(route, params)
            .then(() => {
              window.scroll(0, 0)
            })
        }}
      >
        <Title>{episode.title}</Title>
        <PublishDate date={episode.publishDate} />
      </a>
    )
  }
  return (
    <Link route={route} params={params}>
      <a {...styles.base} {...styles.link}>
        <Title>{episode.title}</Title>
        <PublishDate date={episode.publishDate} />
      </a>
    </Link>
  )
}

const Nav = ({ url, children, t, series }) => {
  const active = matchPath(url.asPath)
  return (
    <div {...styles.container}>
        {series.episodes && series.episodes.map( episode => (
        <EpisodeLink
          episode={episode}
          url={url}
        />
        ))}
    </div>
  )
}

export default withT(Nav)
