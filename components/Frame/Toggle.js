import React from 'react'
import { css } from 'glamor'
import { mediaQueries } from '@project-r/styleguide'
import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  ZINDEX_FRAME_TOGGLE
} from '../constants'

const BLACK = '#282828'
const INNER_SIZE = 24

const buttonStyle = css({
  cursor: 'pointer',
  zIndex: ZINDEX_FRAME_TOGGLE,
  '&, :hover, :focus': {
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    outline: 'none'
  },
  padding: `${Math.floor((HEADER_HEIGHT_MOBILE - INNER_SIZE) / 2)}px`,
  [mediaQueries.mUp]: {
    padding: `${Math.floor((HEADER_HEIGHT - INNER_SIZE) / 2)}px`
  }
})

const toggleStyle = css({
  padding: '3px',
  width: INNER_SIZE,
  height: INNER_SIZE,
  position: 'relative',
  cursor: 'pointer',
  '& span': {
    display: 'block',
    position: 'absolute',
    height: 2,
    backgroundColor: BLACK,
    opacity: 1,
    left: 0,
    width: 24,
    transition:
      'transform .25s ease-in-out, opacity .25s ease-in-out, top .25s ease-in-out, left .25s ease-in-out, width .25s ease-in-out',
    transform: 'rotate(0deg)',
    transformOrigin: 'left center',
    ':hover': {
      backgroundColor: BLACK
    },
    ':nth-child(1)': {
      top: 4
    },
    ':nth-child(2)': {
      top: 11
    },
    ':nth-child(3)': {
      top: 18
    }
  },
  '[aria-expanded=true] > & span:nth-child(1)': {
    transform: 'rotate(45deg)',
    top: 3,
    left: 2
  },
  '[aria-expanded=true] > & span:nth-child(2)': {
    width: 0,
    opacity: 0
  },
  '[aria-expanded=true] > & span:nth-child(3)': {
    transform: 'rotate(-45deg)',
    top: 20,
    left: 2
  }
})

export default ({ expanded, onClick, id }) => {
  return (
    <button
      {...buttonStyle}
      onClick={onClick}
      aria-controls={id}
      title={''}
      aria-expanded={expanded}
    >
      <div {...toggleStyle}>
        <span />
        <span />
        <span />
      </div>
    </button>
  )
}
