import React from 'react'
import { CloseIcon, SearchMenuIcon } from '@project-r/styleguide/icons'
import {
  mediaQueries,
  plainButtonRule,
  useColorContext
} from '@project-r/styleguide'
import { css } from 'glamor'

import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  ZINDEX_FRAME_TOGGLE,
  TRANSITION_MS
} from '../constants'

const SIZE = 28

const Toggle = ({ expanded, onClick, ...props }) => {
  const [colorScheme] = useColorContext()
  return (
    <button {...styles.menuToggle} onClick={onClick} {...props}>
      <SearchMenuIcon
        style={{
          opacity: expanded ? 0.000001 : 1, // hacky fix for browser rendering issue in FF
          transition: `opacity ${TRANSITION_MS}ms ease-out`
        }}
        {...colorScheme.set('fill', 'text')}
        size={SIZE}
      />
      <CloseIcon
        style={{ opacity: expanded ? 1 : 0 }}
        {...styles.closeButton}
        {...colorScheme.set('fill', 'text')}
        size={SIZE}
      />
    </button>
  )
}

const styles = {
  menuToggle: css(plainButtonRule, {
    cursor: 'pointer',
    zIndex: ZINDEX_FRAME_TOGGLE,
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    outline: 'none',
    padding: `${Math.floor((HEADER_HEIGHT_MOBILE - SIZE) / 2)}px`,
    paddingRight: 16,
    lineHeight: 0,
    [mediaQueries.mUp]: {
      padding: `${Math.floor((HEADER_HEIGHT - SIZE) / 2)}px`
    }
  }),
  closeButton: css({
    position: 'absolute',
    right: `${Math.floor((HEADER_HEIGHT_MOBILE - SIZE) / 2)}px`,
    top: `${Math.floor((HEADER_HEIGHT_MOBILE - SIZE) / 2)}px`,
    transition: `opacity ${TRANSITION_MS}ms ease-out`,
    [mediaQueries.mUp]: {
      right: `${Math.floor((HEADER_HEIGHT - SIZE) / 2)}px`,
      top: `${Math.floor((HEADER_HEIGHT - SIZE) / 2)}px`
    }
  })
}

export default Toggle
