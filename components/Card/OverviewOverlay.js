import React from 'react'
import { csvFormat } from 'd3-dsv'

import {
  Editorial
} from '@project-r/styleguide'

import Overlay from './Overlay'
import Table from './Table'

import { swissTime } from '../../lib/utils/format'

import { Paragraph } from './Shared'

const formatDate = swissTime.format('%Y-%m-%d-%H%M')

const OverviewOverlay = ({ onClose, swipes, onReset, isPersisted, group, t }) => {
  const withCache = swipes.filter(swipe => swipe.cardCache)
  const rightSwipes = withCache.filter(swipe => swipe.dir === 1)
  const leftSwipes = withCache.filter(swipe => swipe.dir === -1)
  return (
    <Overlay beta onClose={onClose} title={t('components/Card/Overview/title', {
      groupName: group.name
    })}>
      {!withCache.length && <Paragraph>
        <strong>{t('components/Card/Overview/nothing')}</strong>
      </Paragraph>}
      {!!rightSwipes.length && <>
        <Paragraph><strong>
          {t.pluralize('components/Card/Overview/followTitle', {
            count: rightSwipes.length
          })}
        </strong></Paragraph>
        <Table cards={rightSwipes.map(s => s.cardCache)} />
      </>}
      <br />
      {!!leftSwipes.length && <>
        <Paragraph><strong>
          {t.pluralize('components/Card/Overview/ignoreTitle', {
            count: leftSwipes.length
          })}
        </strong></Paragraph>
        <Table cards={leftSwipes.map(s => s.cardCache)} />
      </>}
      <br />
      <Paragraph><strong>{t('components/Card/Overview/data/title')}</strong></Paragraph>
      <Paragraph>
        {t(`components/Card/Overview/data/${isPersisted ? 'isPersisted' : 'notPersisted'}`)}
      </Paragraph>
      <Paragraph>
        <Editorial.A download={`wahltindaer-${formatDate(new Date())}.csv`} onClick={(e) => {
          const url = e.target.href = URL.createObjectURL(
            new window.Blob(
              [csvFormat(withCache.map(s => ({
                status: s.dir === 1 ? 'folgen' : 'ignorieren',
                name: s.cardCache.user.name,
                partei: s.cardCache.payload.party,
                jahrgang: s.cardCache.payload.yearOfBirth,
                reoublikLink: `https://www.republik.ch/~${s.cardCache.user.slug}`,
                smartvoteLink: s.cardCache.payload.councilOfStates.linkSmartvote || s.cardCache.payload.nationalCouncil.linkSmartvote
              })))],
              { type: 'text/csv' }
            )
          )
          setTimeout(function () { URL.revokeObjectURL(url) }, 50)
        }}>
          {t('components/Card/Overview/data/download')}
        </Editorial.A>
        <br />
        {isPersisted && <Editorial.A href='#' onClick={(e) => {
          e.preventDefault()
          if (!window.confirm(t('components/Card/Overview/data/clear/confirm'))) {
            return
          }
          onReset()
          onClose()
        }}>
          {t('components/Card/Overview/data/clear')}
        </Editorial.A>}
      </Paragraph>
    </Overlay>
  )
}

export default OverviewOverlay
