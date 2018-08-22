import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import { mediaQueries, fontFamilies } from '@project-r/styleguide'
import {
  ZINDEX_POPOVER,
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE
} from '../../constants'

const paddingTop = 3 // max hr height from header

const menuStyle = css({
  fontFamily: fontFamilies.sansSerifRegular,
  position: 'fixed',
  zIndex: ZINDEX_POPOVER,
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
  top: HEADER_HEIGHT_MOBILE - paddingTop,
  paddingTop: paddingTop,
  left: 0,
  right: 0,
  height: `calc(100vh - ${HEADER_HEIGHT_MOBILE - paddingTop}px)`,
  flexDirection: 'column',
  [mediaQueries.mUp]: {
    top: HEADER_HEIGHT - paddingTop,
    height: `calc(100vh - ${HEADER_HEIGHT - paddingTop}px)`
  }
})

const Popover = ({ items, expanded, id, children, url, inNativeApp }) => {
  const height = inNativeApp ? '100vh' : undefined
  const top = inNativeApp ? 0 : undefined

  return (
    <div
      id={id}
      aria-expanded={expanded}
      style={{
        top,
        height
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
