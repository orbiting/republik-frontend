import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import { HEADER_HEIGHT_MOBILE, HEADER_HEIGHT } from '../../constants'
import { mediaQueries, fontFamilies } from '@project-r/styleguide'

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
  top: HEADER_HEIGHT_MOBILE + 1,
  left: 0,
  height: `calc(100vh - ${HEADER_HEIGHT_MOBILE}px)`,
  width: '100vw',
  flexDirection: 'column',
  padding: 20,
  [mediaQueries.mUp]: {
    top: HEADER_HEIGHT + 1,
    height: `calc(100vh - ${HEADER_HEIGHT}px)`
  }
})

const Popover = ({ items, expanded, id, children, url }) => (
  <div {...menuStyle} id={id} aria-expanded={expanded}>
    {children}
  </div>
)

Popover.propTypes = {
  expanded: PropTypes.bool
}

export default Popover
