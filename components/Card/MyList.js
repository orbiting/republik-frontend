import React, { useState } from 'react'
import { csvFormat } from 'd3-dsv'

import {
  Editorial
} from '@project-r/styleguide'

import { Table, TitleRow, CardRows } from './Table'

import { swissTime } from '../../lib/utils/format'

import { Paragraph } from './Shared'
import TrialForm from './TrialForm'

const formatDate = swissTime.format('%Y-%m-%d-%H%M')

const MyList = ({ onClose, swipes, onReset, revertCard, followCard, ignoreCard, queue, isPersisted, isStale, t, me }) => {
  const { statePerUserId, pending } = queue
  const withCache = swipes.filter(swipe => swipe.cardCache)
  const rightSwipes = withCache.filter(swipe => swipe.dir === 1).map(swipe => {
    const pendingItem = pending.find(item => item.userId === swipe.cardCache.user.id)
    return {
      card: swipe.cardCache,
      sub: statePerUserId[swipe.cardCache.user.id] || (pendingItem && pendingItem.sub),
      pending: me && !!pendingItem
    }
  })
  const activeRightSwipes = rightSwipes.filter(swipe => swipe.sub)
  const leftoverRightSwipes = rightSwipes.filter(swipe => !swipe.sub)
  const leftSwipes = leftoverRightSwipes.concat(
    withCache.filter(swipe => swipe.dir === -1).map(swipe => ({
      card: swipe.cardCache
    }))
  )

  const [showIgnore, setShowIgnore] = useState(false)
  const ignoreTitle = t.pluralize('components/Card/MyList/ignoreTitle', {
    count: leftSwipes.length
  })

  return (
    <>
      {(!me || isStale) && <>
        <Paragraph>
          {t('components/Card/MyList/trial')}
        </Paragraph>
        <TrialForm />
        <br />
      </>}
      {!withCache.length
        ? <Paragraph>
          <strong>{t('components/Card/MyList/nothing')}</strong>
        </Paragraph>
        : <Table>
          {!!activeRightSwipes.length && <>
            <TitleRow>
              {t.pluralize('components/Card/MyList/followTitle', {
                count: activeRightSwipes.length
              })}
            </TitleRow>
            <CardRows
              t={t}
              revertCard={revertCard}
              ignoreCard={ignoreCard}
              nodes={activeRightSwipes} />
          </>}
          {!!leftSwipes.length && <>
            <TitleRow onClick={() => {
              setShowIgnore(!showIgnore)
            }}>
              <Editorial.A href='#' onClick={(e) => {
                e.preventDefault()
                setShowIgnore(!showIgnore)
              }}>
                {showIgnore ? ignoreTitle : ignoreTitle.replace(/:$/, '')}
              </Editorial.A>
            </TitleRow>
            {showIgnore && <CardRows
              t={t}
              revertCard={revertCard}
              followCard={followCard}
              nodes={leftSwipes} />}
          </>}
        </Table>
      }
      <br />
      <Paragraph><strong>{t('components/Card/MyList/data/title')}</strong></Paragraph>
      <Paragraph>
        {t(`components/Card/MyList/data/${isPersisted ? 'isPersisted' : 'notPersisted'}`)}
      </Paragraph>
      <br />
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
          {t('components/Card/MyList/data/download')}
        </Editorial.A>
        <br />
        {isPersisted && <Editorial.A href='#' onClick={(e) => {
          e.preventDefault()
          if (!window.confirm(t('components/Card/MyList/data/clear/confirm'))) {
            return
          }
          onReset()
          onClose()
        }}>
          {t('components/Card/MyList/data/clear')}
        </Editorial.A>}
      </Paragraph>
    </>
  )
}

export default MyList
