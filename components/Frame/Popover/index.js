import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import { mediaQueries, fontFamilies } from '@project-r/styleguide'
import { HEADER_HEIGHT_MOBILE, HEADER_HEIGHT } from '../../constants'

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
  top: HEADER_HEIGHT_MOBILE,
  left: 0,
  right: 0,
  height: `calc(100vh - ${HEADER_HEIGHT_MOBILE}px)`,
  flexDirection: 'column',
  [mediaQueries.mUp]: {
    top: HEADER_HEIGHT,
    height: `calc(100vh - ${HEADER_HEIGHT}px)`
  }
})

const Popover = ({ items, expanded, id, children, url, inNativeApp }) => (
  <div
    id={id}
    aria-expanded={expanded}
    style={{
      top: inNativeApp && 0,
      height: inNativeApp && '100vh',
      overflow: inNativeApp && 'scroll'
    }}
    {...menuStyle}
  >
    {children}
  </div>
)

Popover.propTypes = {
  expanded: PropTypes.bool
}

export default Popover
