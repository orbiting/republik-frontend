import React from 'react'
import { css } from 'glamor'
import { colors, mediaQueries } from '@project-r/styleguide'

import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  ZINDEX_POPOVER
} from '../constants'

const HLine = ({ formatColor, dark }) => {
  const hrColor = dark ? colors.negative.divider : colors.divider
  const hrColorStyle = { color: hrColor, backgroundColor: hrColor }
  return (
    <hr
      {...styles.stickyWithFallback}
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
  stickyWithFallback: css({
    // auto prefix does not with multiple values :(
    // - -webkit-sticky would be missing if not defined explicitly
    // - glamor 2.20.40 / inline-style-prefixer 3.0.8
    position: ['fixed', '-webkit-sticky', 'sticky']
    // - this will produce three position statements
    // { position: fixed; position: -webkit-sticky; position: sticky; }
  }),
  hr: css({
    margin: 0,
    display: 'block',
    border: 0,
    width: '100%',
    zIndex: ZINDEX_POPOVER + 2
  }),
  hrThin: css({
    height: 1,
    top: HEADER_HEIGHT_MOBILE - 1,
    [mediaQueries.mUp]: {
      top: HEADER_HEIGHT - 1
    }
  }),
  hrThick: css({
    height: 3,
    top: HEADER_HEIGHT_MOBILE - 3,
    [mediaQueries.mUp]: {
      top: HEADER_HEIGHT - 3
    }
  })
}
