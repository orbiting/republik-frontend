import React from 'react'
import { css } from 'glamor'

import withT from '../../lib/withT'
import { romanize } from '../../lib/utils/romanize'
import { timeFormat } from '../../lib/utils/format'
import HrefLink from '../Link/Href'

import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'

import {
  Breakout,
  Center,
  Editorial,
  TeaserFrontTile,
  TeaserFrontTileHeadline,
  TeaserFrontTileRow,
  TeaserFrontCredit,
  Interaction,
  useColorContext
} from '@project-r/styleguide'

const dayFormat = timeFormat('%d. %B %Y')

const styles = {
  prev: css({
    marginTop: -3,
    marginRight: 5,
    marginLeft: 'calc(-1em - 5px)'
  }),
  next: css({
    marginTop: -3,
    marginLeft: 5,
    marginRight: 'calc(-1em - 5px)'
  }),
  link: css({
    color: 'inherit',
    textDecoration: 'none'
  })
}

const Tile = ({ t, episode, index, prev, next }) => {
  const [colorScheme] = useColorContext()
  const date = episode && episode.publishDate
  const label = episode && episode.label
  const meta = episode && episode.document && episode.document.meta
  const path = meta && meta.path
  const image = (episode && episode.image) || (meta && meta.image)

  const Link = path ? HrefLink : ({ children }) => children
  const headline = (
    <TeaserFrontTileHeadline.Editorial>
      {episode.title}
    </TeaserFrontTileHeadline.Editorial>
  )

  return (
    <Link href={path}>
      <TeaserFrontTile
        attributes={{
          ...colorScheme.set()[path ? 'textColor' : 'lightTextColor']
        }}
        bgColor='inherit'
        color='inherit'
        image={image}
        align={image ? 'top' : undefined}
      >
        <Editorial.Format>
          {prev && <MdKeyboardArrowLeft {...styles.prev} />}
          {label || t('article/series/episode', { count: romanize(index + 1) })}
          {next && <MdKeyboardArrowRight {...styles.next} />}
        </Editorial.Format>
        {path ? (
          <Link href={path} passHref>
            <a {...styles.link}>{headline}</a>
          </Link>
        ) : (
          headline
        )}
        {!!date && (
          <TeaserFrontCredit>{dayFormat(new Date(date))}</TeaserFrontCredit>
        )}
      </TeaserFrontTile>
    </Link>
  )
}

const RelatedEpisodes = ({ t, episodes, path, title }) => {
  const currentEpisodeIndex = episodes.findIndex(
    episode => episode.document && episode.document.meta.path === path
  )
  const previousEpisode = episodes[currentEpisodeIndex - 1]
  const nextEpisode = episodes[currentEpisodeIndex + 1]
  if (!previousEpisode && !nextEpisode) {
    return null
  }

  return (
    <Center>
      <Breakout size='breakout'>
        <Interaction.H3 style={{ textAlign: 'center', marginTop: 50 }}>
          {title}
        </Interaction.H3>
        <TeaserFrontTileRow columns={2} mobileReverse>
          {previousEpisode && (
            <Tile
              t={t}
              episode={previousEpisode}
              prev
              index={episodes.indexOf(previousEpisode)}
            />
          )}
          {nextEpisode && (
            <Tile
              t={t}
              episode={nextEpisode}
              next
              index={episodes.indexOf(nextEpisode)}
            />
          )}
        </TeaserFrontTileRow>
      </Breakout>
    </Center>
  )
}

export default withT(RelatedEpisodes)
