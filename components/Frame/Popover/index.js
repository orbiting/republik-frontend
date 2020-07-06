import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import {
  mediaQueries,
  fontFamilies,
  useBodyScrollLock
} from '@project-r/styleguide'
import {
  ZINDEX_POPOVER,
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE
} from '../../constants'

const menuStyle = css({
  position: 'fixed',
  zIndex: ZINDEX_POPOVER + 3,
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
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch'
})

const Popover = ({ expanded, id, children, formatColor }) => {
  const [ref] = useBodyScrollLock(expanded)
  const hLineHeight = formatColor ? 3 : 1
  return (
    <div
      {...css({
        top: HEADER_HEIGHT_MOBILE - hLineHeight,
        height: `calc(100vh - ${HEADER_HEIGHT_MOBILE - hLineHeight}px)`,
        [mediaQueries.mUp]: {
          top: HEADER_HEIGHT - hLineHeight,
          height: `calc(100vh - ${HEADER_HEIGHT - hLineHeight}px)`
        }
      })}
      id={id}
      aria-expanded={expanded}
      {...menuStyle}
      ref={ref}
    >
      {children}
    </div>
  )
}

Popover.propTypes = {
  expanded: PropTypes.bool
}

export default Popover
