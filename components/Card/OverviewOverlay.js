import React, {} from 'react'

import {
  Overlay, OverlayBody,
  OverlayToolbar, OverlayToolbarConfirm,
  Interaction, Editorial
} from '@project-r/styleguide'

import MdClose from 'react-icons/lib/md/close'

const OverviewOverlay = ({ onClose, swipes, setSwipes, isPersisted }) => {
  return (
    <Overlay onClose={onClose} mUpStyle={{ maxWidth: 700, minHeight: 'none' }}>
      <OverlayToolbar>
        <Interaction.Emphasis style={{ padding: '15px 20px', fontSize: 16 }}>
          Ihre Übersicht
        </Interaction.Emphasis>
        <OverlayToolbarConfirm
          onClick={onClose}
          label={<MdClose size={24} fill='#000' />}
        />
      </OverlayToolbar>
      <OverlayBody>
        <div style={{ textAlign: 'left' }}>
          <Interaction.H2>Folgen</Interaction.H2>
          <Editorial.UL>
            {swipes.filter(swipe => swipe.dir === 1 && swipe.metaCache).map(swipe => {
              return <Editorial.LI key={swipe.cardId}>{swipe.metaCache.name}</Editorial.LI>
            })}
          </Editorial.UL>
          <Interaction.H2>Ignorieren</Interaction.H2>
          <Editorial.UL>
            {swipes.filter(swipe => swipe.dir === -1 && swipe.metaCache).map(swipe => {
              return <Editorial.LI key={swipe.cardId}>{swipe.metaCache.name}</Editorial.LI>
            })}
          </Editorial.UL>
          <br />
          {isPersisted && <Editorial.A href='#' onClick={(e) => {
            e.preventDefault()
            setSwipes([])
            onClose()
          }}>
            Alles löschen
          </Editorial.A>}
        </div>
      </OverlayBody>
    </Overlay>
  )
}

export default OverviewOverlay
