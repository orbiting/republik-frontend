import React from 'react'
import { MdClose } from 'react-icons/md'
import SearchMenuIcon from '../Icons/SearchMenu'
import { colors, mediaQueries } from '@project-r/styleguide'
import { css } from 'glamor'

import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  ZINDEX_FRAME_TOGGLE,
  TRANSITION_MS
} from '../constants'

const SIZE = 28

const Toggle = ({ dark, expanded, ...props }) => {
  return (
    <div {...styles.menuToggle} {...props}>
      <SearchMenuIcon
        style={{
          opacity: expanded ? 0 : 1,
          transition: `opacity ${TRANSITION_MS}ms ease-out`
        }}
        fill={dark ? colors.negative.text : colors.text}
        size={SIZE}
      />
      <MdClose
        style={{ opacity: expanded ? 1 : 0 }}
        {...styles.closeButton}
        size={SIZE}
        fill={dark ? colors.negative.text : colors.text}
      />
    </div>
  )
}

const styles = {
  menuToggle: css({
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
    marginTop: -2,
    right: 10,
    transition: `opacity ${TRANSITION_MS}ms ease-out`,
    [mediaQueries.mUp]: {
      right: 16
    }
  })
}

export default Toggle
