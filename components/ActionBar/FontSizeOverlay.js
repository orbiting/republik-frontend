import React from 'react'

import {
  Overlay, OverlayBody,
  OverlayToolbar, OverlayToolbarConfirm,
  Interaction
} from '@project-r/styleguide'

import MdClose from 'react-icons/lib/md/close'

import withT from '../../lib/withT'
import Slider from '../Card/Slider'

const FontSizeOverlay = ({
  onClose
}) => {
  return (
    <Overlay onClose={onClose} mUpStyle={{ maxWidth: 400, minHeight: 'none' }}>
      <OverlayToolbar>
        <Interaction.Emphasis style={{ padding: '15px 20px', fontSize: 16 }}>
          Adjust Font Size
        </Interaction.Emphasis>
        <OverlayToolbarConfirm
          onClick={onClose}
          label={<MdClose size={24} fill='#000' />}
        />
      </OverlayToolbar>
      <OverlayBody>
        <div>
          <Slider
            labelLeft='t'
            label='T'
            value='100'
            min='50'
            max='300'
            onChange={(e) => {
              e.preventDefault()
            }} />
        </div>
      </OverlayBody>
    </Overlay>
  )
}

export default withT(FontSizeOverlay)
