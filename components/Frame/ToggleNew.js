import React, { Fragment } from 'react'
import { MdClose } from 'react-icons/md'
import SearchMenuIcon from '../Icons/SearchMenu'
import { colors, mediaQueries } from '@project-r/styleguide'
import { css } from 'glamor'

import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  ZINDEX_FRAME_TOGGLE, 
  TRANSITION_MS,
} from '../constants'

const ToggleNew = ({ dark, size, expanded, ...props }) => {
  return (
    <div {...styles.menuToggle} {...props}>
      <SearchMenuIcon
        style={{
          opacity: expanded ? 0 : 1
        }}
        {...styles.transition}
        dark={dark}
        size={size}
      />
      <MdClose
        style={{ position: 'absolute', right: 4, opacity: expanded ? 1 : 0 }}
        {...styles.transition}
        size={size}
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
    padding: `${Math.floor((HEADER_HEIGHT_MOBILE - 26) / 2)}px`,
    [mediaQueries.mUp]: {
      padding: `${Math.floor((HEADER_HEIGHT - 26) / 2)}px`
    }
  }),
  transition: css({
    transition: `opacity ${TRANSITION_MS}ms ease-out`
  })
}

export default ToggleNew
