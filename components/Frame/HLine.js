import React from 'react'
import { css } from 'glamor'
import { colors } from '@project-r/styleguide'

import { ZINDEX_POPOVER } from '../constants'

const HLine = ({
  formatColor,
  dark,
  isHeaderFullyScrolledAway,
  secondaryNav,
  hasOverviewNav
}) => {
  const hrColor = dark ? colors.negative.divider : colors.divider
  const hrStyle = formatColor
    ? {
        color: formatColor,
        backgroundColor: formatColor
      }
    : {
        color: hrColor,
        backgroundColor: hrColor,
        opacity:
          isHeaderFullyScrolledAway && !secondaryNav && !hasOverviewNav ? 0 : 1
      }
  return (
    <hr
      {...styles.hr}
      {...styles[formatColor ? 'hrThick' : 'hrThin']}
      style={hrStyle}
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
