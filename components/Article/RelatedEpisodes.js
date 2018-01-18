import React, { Component, Fragment } from 'react'
import { css } from 'glamor'
import { Link } from '../../lib/routes'
import withT from '../../lib/withT'
import { romanize } from '../../lib/utils/romanize'
import { timeFormat } from '../../lib/utils/format'

import {
  colors,
  Breakout,
  Center,
  Editorial,
  TeaserFrontTile,
  TeaserFrontTileHeadline,
  TeaserFrontTileRow,
  TeaserFrontCredit,
  TeaserFrontCreditLink,
  TeaserFrontLead
} from '@project-r/styleguide'

const dayFormat = timeFormat('%d. %B %Y')

const DefaultLink = ({ children }) => children

const Tile = ({ t, episode, index, LinkComponent = DefaultLink }) => {
  const date = episode && episode.publishDate
  const label = episode && episode.label
  const meta = episode && episode.document && episode.document.meta
  const route = meta && meta.path
  const image = (meta && meta.image) || (episode && episode.image)

  if (route) {
    LinkComponent = ({ children }) => <Link route={route}>{children}</Link>
  }
  return (
    <LinkComponent>
      <TeaserFrontTile
        color={route ? colors.text : colors.lightText}
        image={image}
      >
        <Editorial.Format>
          {label || t('article/series/episode', { count: romanize(index + 1) })}
        </Editorial.Format>
        <TeaserFrontTileHeadline.Editorial>
          {episode.title}
        </TeaserFrontTileHeadline.Editorial>
        {!!date && (
          <TeaserFrontCredit>{dayFormat(Date.parse(date))}</TeaserFrontCredit>
        )}
      </TeaserFrontTile>
    </LinkComponent>
  )
}

const RelatedEpisodes = ({ t, episodes, path }) => {
  let nextEpisode, previousEpisode

  const currentEpisodeIndex = episodes
    .map(episode => episode.document && episode.document.meta.path)
    .indexOf(path)
  previousEpisode = currentEpisodeIndex > 0 && episodes[currentEpisodeIndex - 1]
  nextEpisode = episodes[currentEpisodeIndex + 1]

  return (
    <Fragment>
      {(previousEpisode || nextEpisode) && (
        <Center>
          <Breakout size="breakout">
            <TeaserFrontTileRow columns={2}>
              {previousEpisode && (
                <Tile
                  t={t}
                  episode={previousEpisode}
                  index={currentEpisodeIndex - 1}
                />
              )}
              {nextEpisode && (
                <Tile
                  t={t}
                  episode={nextEpisode}
                  index={currentEpisodeIndex + 1}
                />
              )}
            </TeaserFrontTileRow>
          </Breakout>
        </Center>
      )}
    </Fragment>
  )
}

export default withT(RelatedEpisodes)
