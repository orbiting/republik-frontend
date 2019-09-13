import React from 'react'

import {
  Editorial
} from '@project-r/styleguide'

import withT from '../../lib/withT'

import { Paragraph, Finance } from './Shared'

const Details = ({ card, t }) => {
  const { payload } = card

  const { electionPlausibility } = payload.nationalCouncil
  const plausibilityText = t(`components/Card/electionPlausibility/${electionPlausibility}`, undefined, '')
  const plausibilityEmoji = t(`components/Card/electionPlausibility/${electionPlausibility}/emoji`, undefined, '')

  const linkSmartvote = payload.councilOfStates.linkSmartvote || payload.nationalCouncil.linkSmartvote
  const incumbent = payload.councilOfStates.incumbent || payload.nationalCouncil.incumbent

  return (
    <>
      {!!payload.nationalCouncil.listName && <Paragraph>
        Liste: {payload.nationalCouncil.listName}<br />
        {payload.nationalCouncil.listPlaces && <>
          Listenplatz: {payload.nationalCouncil.listPlaces.join(' & ')}
        </>}
      </Paragraph>}
      <Paragraph>
        {!!plausibilityText && t('components/Card/electionPlausibility/title', {
          text: plausibilityText,
          emoji: plausibilityEmoji
        })}
      </Paragraph>
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
        <Editorial.A href='https://lobbywatch.ch/de/daten/parlamentarier'>
          {t('components/Card/Details/lobbywatch')}
        </Editorial.A><br />
        <small>{t('components/Card/Details/lobbywatch/note')}</small>
      </Paragraph>}
      <Finance payload={payload} />
    </>
  )
}

export default withT(Details)
