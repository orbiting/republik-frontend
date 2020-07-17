import React from 'react'
import { css } from 'glamor'
import { colors } from '@project-r/styleguide'

import { ZINDEX_POPOVER } from '../constants'

const HLine = ({ formatColor, dark }) => {
  const color = formatColor || (dark ? colors.negative.divider : colors.divider)
  return (
    <hr
      {...styles.hr}
      style={{
        color,
        backgroundColor: color,
        height: formatColor ? 3 : 1
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
  })
}
