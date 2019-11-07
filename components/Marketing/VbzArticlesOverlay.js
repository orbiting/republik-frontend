import React from 'react'
import {
  Interaction,
  Overlay,
  OverlayBody,
  OverlayToolbar,
  OverlayToolbarConfirm,
  colors,
  Editorial,
  Button
} from '@project-r/styleguide'
import MdClose from 'react-icons/lib/md/close'
import { css } from 'glamor'

const styles = {
  headline: css({
    padding: '0 20px 20px'
    // backgroundColor: '#2c2e35'
  })
}

export default ({ onClose }) => {
  return (
    <Overlay onClose={onClose} mUpStyle={{ maxWidth: 400, minHeight: 'none' }}>
      <div style={{ backgroundColor: '#2c2e35' }}>
        <OverlayToolbarConfirm
          onClick={onClose}
          label={<MdClose size={24} fill="#fff" />}
        />
        <div {...styles.headline}>
          <Editorial.Subhead style={{ margin: '0 auto 20px', color: 'white' }}>
            « Was China mit seinen 60 Milliarden in der Schweiz schon so alles
            gekauft gekauft hat. »
          </Editorial.Subhead>
          <Button white style={{ height: 48 }}>
            Artikel lesen
          </Button>
        </div>
        <div
          style={{
            backgroundColor: colors.negative.primaryBg,
            padding: '10px 20px 20px 20px',
            color: colors.negative.text
          }}
        >
          <div {...css(styles.serifBold17)}>
            Was China mit seinen 60 Milliarden in der Schweiz schon so alles
            gekauft gekauft hat.
          </div>
          <Editorial.P>
            Was China mit seinen 60 Milliarden in der Schweiz schon so alles
            gekauft gekauft hat.
          </Editorial.P>
          <Editorial.P>
            Was China mit seinen 60 Milliarden in der Schweiz schon so alles
            gekauft gekauft hat.
          </Editorial.P>
        </div>
      </div>
    </Overlay>
  )
}
