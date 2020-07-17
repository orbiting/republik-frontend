import React from 'react'
import { css } from 'glamor'
import { colors } from '@project-r/styleguide'

import { ZINDEX_POPOVER } from '../constants'

const HLine = ({ formatColor, dark }) => {
  const hrColor = dark ? colors.negative.divider : colors.divider
  return (
    <hr
      {...styles.hr}
      {...styles[formatColor ? 'hrThick' : 'hrThin']}
      style={{
        color: formatColor || hrColor,
        backgroundColor: formatColor || hrColor
      }}
    />
  )
}

export default HLine

const styles = {
  hr: css({
    margin: 0,
    display: 'block',
    border: 0,
    width: '100%',
    zIndex: ZINDEX_POPOVER + 2
  }),
  hrThin: css({
    height: 1
  }),
  hrThick: css({
    height: 3
  })
}
