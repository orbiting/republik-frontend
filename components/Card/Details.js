import React from 'react'
import { css } from 'glamor'

import {
  mediaQueries,
  Editorial
} from '@project-r/styleguide'

import withT from '../../lib/withT'

import getPartyColor from './partyColors'
import { Paragraph, Finance } from './Shared'
import Spider from './Spider'

const SPIDER_SIZE = 260

const styles = {
  spider: css({
    [mediaQueries.mUp]: {
      float: 'right',
      width: SPIDER_SIZE,
      marginLeft: 10,
      marginBottom: 10
    }
  })
}

const Details = ({ card, t, mySmartspider, skipSpider }) => {
  const { payload } = card

  const { electionPlausibility } = payload.nationalCouncil
  const plausibilityText = t(`components/Card/electionPlausibility/${electionPlausibility}`, undefined, '')
  const plausibilityEmoji = t(`components/Card/electionPlausibility/${electionPlausibility}/emoji`, undefined, '')

  const linkSmartvote = payload.councilOfStates.linkSmartvote || payload.nationalCouncil.linkSmartvote
  const incumbent = payload.councilOfStates.incumbent || payload.nationalCouncil.incumbent

  const partyColor = getPartyColor(payload.party)

  return (
    <>
      {payload.smartvoteCleavage && !skipSpider && <div {...styles.spider}>
        <Spider
          size={SPIDER_SIZE}
          fill={partyColor}
          data={payload.smartvoteCleavage}
          reference={mySmartspider} />
      </div>}
      {!!payload.nationalCouncil.listName && <Paragraph>
        Liste: {payload.nationalCouncil.listName}<br />
        {payload.nationalCouncil.listPlaces && <>
          Listenplatz: {payload.nationalCouncil.listPlaces.join(' & ')}<br />
        </>}
        {!!plausibilityText && <>
          {t('components/Card/electionPlausibility/title', {
            text: plausibilityText,
            emoji: plausibilityEmoji
          })}
        </>}
      </Paragraph>}
      <Paragraph>
        Beruf: {payload.occupation}
      </Paragraph>
      <Paragraph style={{ marginTop: 10 }}>
        <strong>{t('components/Card/Details/links')}</strong>
      </Paragraph>
      {!!linkSmartvote && <Paragraph style={{ marginBottom: 10 }}>
        <Editorial.A
          href={linkSmartvote}>
          {t('components/Card/Details/smartvote')}
        </Editorial.A><br />
        <small>{t('components/Card/Details/smartvote/note')}</small>
      </Paragraph>}
      {!!incumbent && <Paragraph style={{ marginBottom: 10 }}>
        <Editorial.A href={(payload.lobbywatch && payload.lobbywatch.link) || 'https://lobbywatch.ch/de/daten/parlamentarier'}>
          {t('components/Card/Details/lobbywatch')}
        </Editorial.A><br />
        <small>{t('components/Card/Details/lobbywatch/note')}</small>
      </Paragraph>}
      <Finance payload={payload} />
    </>
  )
}

export default withT(Details)
