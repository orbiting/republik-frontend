import React, { Component } from 'react'

import {
  Overlay, OverlayBody,
  OverlayToolbar, OverlayToolbarConfirm,
  Interaction
} from '@project-r/styleguide'

import MdClose from 'react-icons/lib/md/close'
import withT from '../../lib/withT'
import Slider from '../Card/Slider'
import { compose } from 'react-apollo'

class FontSizeOverlay extends Component {
  constructor (props) {
    super(props)

    this.state = {
      fontSize: 100
    }

    this.setFontSize = (value) => {
      this.setState({
        fontSize: value
      })
    }
  }

  render () {
    const { onClose } = this.props
    const { fontSize } = this.state

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
              value={fontSize}
              min='50'
              max='300'
              step='25'
              title={'Font size: ' + fontSize + '%'}
              onChange={(e, newValue) => {
                this.setFontSize(newValue)
              }} />
          </div>
        </OverlayBody>
      </Overlay>
    )
  }
}

export default compose(withT)(FontSizeOverlay)
