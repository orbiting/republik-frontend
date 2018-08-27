import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import { mediaQueries, fontFamilies } from '@project-r/styleguide'
import {
  ZINDEX_POPOVER,
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE
} from '../../constants'

const paddingTop = 3 + 1 // max hr height from header plus a pixel for zoom cases

const menuStyle = css({
  position: 'fixed',
  zIndex: ZINDEX_POPOVER,
  left: 0,
  right: 0,
  fontFamily: fontFamilies.sansSerifRegular,
  backgroundColor: '#fff',
  flexDirection: 'column',
  opacity: 0,
  visibility: 'hidden',
  transition: 'opacity 0.2s ease-in-out, visibility 0s linear 0.2s',
  '&[aria-expanded=true]': {
    opacity: 1,
    visibility: 'visible',
    transition: 'opacity 0.2s ease-in-out'
  },
  paddingTop: paddingTop,
  top: HEADER_HEIGHT_MOBILE - paddingTop,
  height: `calc(100vh - ${HEADER_HEIGHT_MOBILE - paddingTop}px)`,
  [mediaQueries.mUp]: {
    top: HEADER_HEIGHT - paddingTop,
    height: `calc(100vh - ${HEADER_HEIGHT - paddingTop}px)`
  }
})

const Popover = ({ items, expanded, id, children, url }) => (
  <div
    id={id}
    aria-expanded={expanded}
    {...menuStyle}
  >
    {children}
  </div>
)

Popover.propTypes = {
  expanded: PropTypes.bool
}

export default Popover
