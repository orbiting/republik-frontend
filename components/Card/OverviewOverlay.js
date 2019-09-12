import React from 'react'

import {
  Interaction, Editorial
} from '@project-r/styleguide'

import Overlay from './Overlay'

const OverviewOverlay = ({ onClose, swipes, onReset, isPersisted, group, t }) => {
  const withMetaCache = swipes.filter(swipe => swipe.metaCache)
  const rightSwipes = withMetaCache.filter(swipe => swipe.dir === 1)
  const leftSwipes = withMetaCache.filter(swipe => swipe.dir === -1)
  return (
    <Overlay onClose={onClose} title={t('components/Card/Overview/title', {
      groupName: group.name
    })}>
      {!withMetaCache.length && <Interaction.P>
        {t('components/Card/Overview/nothing')}
      </Interaction.P>}
      {!!rightSwipes.length && <>
        <Interaction.H3>{t.pluralize('components/Card/Overview/followTitle', {
          count: rightSwipes.length
        })}</Interaction.H3>
        <Editorial.UL>
          {rightSwipes.map(swipe => {
            return <Editorial.LI key={swipe.cardId}>{swipe.metaCache.name}</Editorial.LI>
          })}
        </Editorial.UL>
      </>}
      {!!leftSwipes.length && <>
        <Interaction.H3>{t.pluralize('components/Card/Overview/ignoreTitle', {
          count: leftSwipes.length
        })}</Interaction.H3>
        <Editorial.UL>
          {leftSwipes.map(swipe => {
            return <Editorial.LI key={swipe.cardId}>{swipe.metaCache.name}</Editorial.LI>
          })}
        </Editorial.UL>
      </>}
      <br />
      <Interaction.H3>{t('components/Card/Overview/data/title')}</Interaction.H3>
      <Interaction.P>
        {t(`components/Card/Overview/data/${isPersisted ? 'isPersisted' : 'notPersisted'}`)}
      </Interaction.P>
      <Interaction.P>
        <Editorial.A>{t('components/Card/Overview/data/download')}</Editorial.A>
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
      </Interaction.P>
    </Overlay>
  )
}

export default OverviewOverlay
