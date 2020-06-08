import React, { Fragment, useState, useEffect } from 'react'
import { withRouter } from 'next/router'

import { css, merge } from 'glamor'
import { Link } from '../../lib/routes'
import { timeFormat } from '../../lib/utils/format'
import { romanize } from '../../lib/utils/romanize'
import withT from '../../lib/withT'

import {
  MdKeyboardArrowDown as ArrowDownIcon,
  MdKeyboardArrowRight as ArrowRightIcon
} from 'react-icons/md'

import {
  Editorial,
  colors,
  fontStyles,
  mediaQueries,
  TeaserFrontCredit
} from '@project-r/styleguide'

const dayFormat = timeFormat('%d. %B %Y')

const styles = {
  base: css({
    cursor: 'default',
    display: 'block',
    padding: '20px 15px',
    textAlign: 'center',
    borderBottom: `1px solid ${colors.negative.lightText}`
  }),
  arrow: css({
    marginLeft: 10,
    marginRight: -10,
    [mediaQueries.mUp]: {
      marginLeft: 20,
      marginRight: -20
    }
  }),
  small: css({
    padding: '5px 15px',
    borderBottomColor: colors.negative.lightFill,
    backgroundColor: '#323232'
  }),
  link: css({
    textDecoration: 'none',
    color: colors.negative.text,
    ':visited': {
      color: colors.negative.text
    },
    '@media (hover)': {
      ':hover': {
        color: colors.negative.primary
      }
    },
    cursor: 'pointer'
  }),
  unpublished: css({
    color: colors.negative.lightText
  }),
  title: css({
    ...fontStyles.serifTitle26,
    [mediaQueries.mUp]: {
      ...fontStyles.serifTitle38
    }
  }),
  subtitle: css({
    ...fontStyles.serifTitle20,
    [mediaQueries.mUp]: {
      ...fontStyles.serifTitle26
    }
  }),
  date: css({
    ...fontStyles.sansSerifRegular15,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular21
    }
  })
}

const Title = ({ children }) => <h2 {...styles.title}>{children}</h2>
const Subtitle = ({ children }) => <h3 {...styles.subtitle}>{children}</h3>

const LinkContent = ({ episode, isOpen, index, t, hasParts }) => {
  const label = episode && episode.label
  const publishDate = episode && episode.publishDate
  return (
    <Fragment>
      <Editorial.Format>
        {label || t('article/series/episode', { count: romanize(index + 1) })}
      </Editorial.Format>
      <Title>
        {episode.title}
        {!!hasParts && (
          <span {...styles.arrow}>
            {isOpen ? (
              <ArrowRightIcon size='36' />
            ) : (
              <ArrowDownIcon size='36' />
            )}
          </span>
        )}
      </Title>
      {!!publishDate && (
        <TeaserFrontCredit>
          {dayFormat(Date.parse(publishDate))}
        </TeaserFrontCredit>
      )}
    </Fragment>
  )
}

const getRoute = document => document && document.meta && document.meta.path

const EpisodeLink = withRouter(
  ({ episode, onClick, params = {}, router, small, children, themeColors }) => {
    const route = getRoute(episode.document)
    const currentColors = css({
      backgroundColor: themeColors ? themeColors.containerBg : '#fff',
      color: themeColors ? themeColors.text : colors.text
    })
    const baseStyles = merge(styles.base, small && styles.small)

    useEffect(() => {
      if (!episode || !episode.parts || !episode.parts.length || !router) return
      const partsRoutes = episode.parts.map(part => getRoute(part.document))
      if (
        partsRoutes.some(
          partRoute => router.asPath && router.asPath === partRoute
        )
      ) {
        onClick && onClick()
      }
    }, [episode, router])

    if (!route) {
      return <div {...merge(baseStyles, styles.unpublished)}>{children}</div>
    }
    if (router.asPath && router.asPath === route) {
      return (
        <div
          {...merge(baseStyles, currentColors)}
          onClick={() => onClick && onClick()}
        >
          {children}
        </div>
      )
    }
    if (onClick) {
      return (
        <div {...baseStyles} onClick={() => onClick()}>
          {children}
        </div>
      )
    }
    return (
      <Link route={route} params={params}>
        <a {...merge(baseStyles, styles.link)}>{children}</a>
      </Link>
    )
  }
)

const EpisodeNav = ({ episode, t, index, isOpen, setOpen, themeColors }) => {
  const hasParts = episode && episode.parts && episode.parts.length
  const onClick = isOpen || !hasParts ? false : setOpen
  return (
    <>
      <EpisodeLink
        episode={episode}
        onClick={onClick}
        themeColors={themeColors}
      >
        <LinkContent
          episode={episode}
          index={index}
          t={t}
          isOpen={isOpen}
          hasParts={hasParts}
        />
      </EpisodeLink>
      {isOpen ? (
        <div>
          {episode.parts.map((part, j) => (
            <EpisodeLink key={j} episode={part} small themeColors={themeColors}>
              <Subtitle>
                {j + 1}. {part.title}
              </Subtitle>
            </EpisodeLink>
          ))}
        </div>
      ) : null}
    </>
  )
}

const Nav = ({ t, series, themeColors }) => {
  const [open, setOpen] = useState(-1)
  return (
    <>
      {series.episodes &&
        series.episodes.map((episode, i) => (
          <div key={i}>
            <EpisodeNav
              t={t}
              index={i}
              episode={episode}
              isOpen={open === i}
              setOpen={() => setOpen(i)}
              themeColors={themeColors}
            />
          </div>
        ))}
    </>
  )
}

export default withT(Nav)
