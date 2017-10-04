import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import {
  HEADER_HEIGHT_MOBILE,
  HEADER_HEIGHT,
  MENUBAR_HEIGHT
} from '../constants'

import { colors, mediaQueries, fontFamilies } from '@project-r/styleguide'

const M_HEADER_HEIGHT = HEADER_HEIGHT_MOBILE + MENUBAR_HEIGHT

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
  [mediaQueries.onlyS]: {
    display: 'flex',
    boxSizing: 'border-box',
    top: M_HEADER_HEIGHT,
    left: 0,
    height: `calc(100vh - ${M_HEADER_HEIGHT}px)`,
    width: '100vw',
    flexDirection: 'column',
    padding: 20,
    paddingTop: 50
  },
  [mediaQueries.mUp]: {
    display: 'block',
    whiteSpace: 'none',
    minWidth: 220,
    maxWidth: '30vw',
    right: 0,
    padding: 10,
    top: HEADER_HEIGHT,
    borderBottom: `1px solid ${colors.divider}`
  }
})

const Popover = ({ items, expanded, id, children, url }) =>
  <div {...menuStyle} id={id} aria-expanded={expanded}>
    {children}
  </div>

Popover.propTypes = {
  expanded: PropTypes.bool
}

export default Popover
