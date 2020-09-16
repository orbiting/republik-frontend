import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import {
  mediaQueries,
  fontFamilies,
  useBodyScrollLock,
  useColorContext
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

const Popover = ({ expanded, id, children, dark }) => {
  const [ref] = useBodyScrollLock(expanded)
  const [colorScheme] = useColorContext()
  return (
    <div
      {...css(menuStyle, {
        top: HEADER_HEIGHT_MOBILE,
        height: `calc(100vh - ${HEADER_HEIGHT_MOBILE}px)`,
        borderTop: `1px solid ${colorScheme.divider}`,
        backgroundColor: colorScheme.containerBg,
        [mediaQueries.mUp]: {
          top: HEADER_HEIGHT,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`
        }
      })}
      id={id}
      aria-expanded={expanded}
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
