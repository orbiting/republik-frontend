import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import { mediaQueries, fontFamilies } from '@project-r/styleguide'
import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  SAFE_TOP_HEIGHT,
  SAFE_TOP_HEIGHT_MOBILE
} from '../../constants'

const menuStyle = css({
  fontFamily: fontFamilies.sansSerifRegular,
  position: 'absolute',
  backgroundColor: '#fff',
  visibility: 'hidden',
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out, visibility 0s linear 0.2s',
  '&[aria-expanded=true]': {
    opacity: 1,
    visibility: 'visible',
    transition: 'opacity 0.2s ease-in-out'
  },
  display: 'flex',
  boxSizing: 'border-box',
  top: SAFE_TOP_HEIGHT_MOBILE,
  left: 0,
  right: 0,
  height: `calc(100vh - ${SAFE_TOP_HEIGHT_MOBILE}px)`,
  flexDirection: 'column',
  [mediaQueries.mUp]: {
    top: SAFE_TOP_HEIGHT,
    height: `calc(100vh - ${SAFE_TOP_HEIGHT}px)`
  }
})

const Popover = ({ items, expanded, id, children, url, inNativeApp, me, isMobile }) => {
  const baseHeight = me
    ? isMobile
      ? SAFE_TOP_HEIGHT_MOBILE : SAFE_TOP_HEIGHT
    : isMobile
      ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT
  const height = inNativeApp ? '100vh' : `calc(100vh - ${baseHeight}px)`
  const top = inNativeApp ? 0 : baseHeight
  const overflow = inNativeApp ? 'scroll' : undefined

  return (
    <div
      id={id}
      aria-expanded={expanded}
      style={{
        top,
        height,
        overflow
      }}
      {...menuStyle}
    >
      {children}
    </div>
  )
}

Popover.propTypes = {
  expanded: PropTypes.bool
}

export default Popover
