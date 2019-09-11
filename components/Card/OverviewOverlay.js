import React, {} from 'react'

import {
  Interaction, Editorial
} from '@project-r/styleguide'

import Overlay from './Overlay'

const OverviewOverlay = ({ onClose, swipes, setSwipes, isPersisted }) => {
  const withMetaCache = swipes.filter(swipe => swipe.metaCache)
  const rightSwipes = withMetaCache.filter(swipe => swipe.dir === 1)
  const leftSwipes = withMetaCache.filter(swipe => swipe.dir === -1)
  return (
    <Overlay onClose={onClose} title='Ihre Übersicht'>
      {!!rightSwipes.length && <>
        <Interaction.H2>Folgen</Interaction.H2>
        <Editorial.UL>
          {rightSwipes.map(swipe => {
            return <Editorial.LI key={swipe.cardId}>{swipe.metaCache.name}</Editorial.LI>
          })}
        </Editorial.UL>
      </>}
      {!!leftSwipes.length && <>
        <Interaction.H2>Ignorieren</Interaction.H2>
        <Editorial.UL>
          {leftSwipes.map(swipe => {
            return <Editorial.LI key={swipe.cardId}>{swipe.metaCache.name}</Editorial.LI>
          })}
        </Editorial.UL>
      </>}
      <br />
      {isPersisted && <Editorial.A href='#' onClick={(e) => {
        e.preventDefault()
        setSwipes([])
        onClose()
      }}>
        Alles löschen
      </Editorial.A>}
    </Overlay>
  )
}

export default OverviewOverlay
