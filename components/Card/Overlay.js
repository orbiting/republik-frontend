import React from 'react'

import {
  Overlay, OverlayBody,
  OverlayToolbar, OverlayToolbarConfirm,
  Interaction
} from '@project-r/styleguide'

import MdClose from 'react-icons/lib/md/close'

const CardOverlay = ({ onClose, title, children, maxWidth = 720 }) => {
  return (
    <Overlay onClose={onClose} mUpStyle={{ maxWidth, minHeight: 'none' }}>
      <OverlayToolbar>
        <Interaction.Emphasis style={{ padding: '15px 20px', fontSize: 16 }}>
          {title}
        </Interaction.Emphasis>
        <OverlayToolbarConfirm
          onClick={onClose}
          label={<MdClose size={24} fill='#000' />}
        />
      </OverlayToolbar>
      <OverlayBody style={{ textAlign: 'left' }}>
        {children}
      </OverlayBody>
    </Overlay>
  )
}

export default CardOverlay
