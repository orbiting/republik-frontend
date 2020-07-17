import React from 'react'
import { css } from 'glamor'
import { colors } from '@project-r/styleguide'

import { ZINDEX_POPOVER } from '../constants'

const HLine = ({
  formatColor,
  dark,
  isSecondarySticky,
  secondaryNav,
  hasOverviewNav
}) => {
  const hrColor = dark ? colors.negative.divider : colors.divider
  const hrColorStyle = {
    color: hrColor,
    backgroundColor: hrColor,
    opacity: isSecondarySticky && !secondaryNav && !hasOverviewNav ? 0 : 1
  }
  return (
    <hr
      {...styles.hr}
      {...styles[formatColor ? 'hrThick' : 'hrThin']}
      style={
        formatColor
          ? {
              color: formatColor,
              backgroundColor: formatColor
            }
          : hrColorStyle
      }
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
