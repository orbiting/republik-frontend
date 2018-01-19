import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { negativeColors } from '../Frame/Footer'
import SeriesNavPanel from './SeriesNavPanel'

import ArrowDownIcon from 'react-icons/lib/md/keyboard-arrow-down'
import ArrowUpIcon from 'react-icons/lib/md/keyboard-arrow-up'

import { HEADER_HEIGHT_MOBILE, HEADER_HEIGHT } from '../constants'
import {
  Label,
  mediaQueries,
  fontFamilies,
  colors
} from '@project-r/styleguide'

const styles = {
  button: css({
    cursor: 'pointer',
    '&, &:hover, &:focus': {
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: 'none',
      outline: 'none'
    },
    padding: 0,
    position: 'absolute',
    textAlign: 'left',
    top: 0,
    whiteSpace: 'nowrap',
    width: `calc(100vw - ${2 * HEADER_HEIGHT_MOBILE}px)`,
    [mediaQueries.mUp]: {
      width: `calc(100vw - ${2 * HEADER_HEIGHT}px)`
    }
  }),
  menu: css({
    backgroundColor: negativeColors.primaryBg,
    color: negativeColors.text,
    fontFamily: fontFamilies.sansSerifRegular,
    position: 'absolute',
    visibility: 'hidden',
    whiteSpace: 'normal',
    opacity: 0,
    overflow: 'scroll',
    transition: 'opacity 0.2s ease-in-out, visibility 0s linear 0.2s',
    '&[aria-expanded=true]': {
      opacity: 1,
      visibility: 'visible',
      transition: 'opacity 0.2s ease-in-out'
    },
    display: 'flex',
    boxSizing: 'border-box',
    top: HEADER_HEIGHT_MOBILE,
    left: '-15px',
    height: `calc(100vh - ${HEADER_HEIGHT_MOBILE}px)`,
    width: '100vw',
    flexDirection: 'column',
    padding: 0,
    [mediaQueries.mUp]: {
      top: HEADER_HEIGHT,
      height: `calc(100vh - ${HEADER_HEIGHT}px)`
    }
  }),
  title: css({
    fontSize: 15,
    display: 'inline-block',
    verticalAlign: 'middle',
    lineHeight: `${HEADER_HEIGHT_MOBILE}px`,
    maxWidth: '100%',
    overflow: 'hidden',
    paddingRight: '30px',
    position: 'relative',
    textOverflow: 'ellipsis',
    [mediaQueries.mUp]: {
      fontSize: 18,
      lineHeight: `${HEADER_HEIGHT}px`
    }
  }),
  arrow: css({
    position: 'absolute',
    right: 0,
    height: '28px',
    top: '50%',
    lineHeight: '28px',
    marginTop: '-15px'
  })
}

export default ({
  items,
  id,
  children,
  t,
  url,
  series,
  onSecondaryNavExpandedChange,
  expanded
}) => (
  <button
    {...styles.button}
    onClick={() => {
      onSecondaryNavExpandedChange(!expanded)
    }}
  >
    <span {...styles.title}>
      {series.title}
      <span {...styles.arrow}>
        {expanded && <ArrowUpIcon size="28" fill={colors.text} />}
        {!expanded && <ArrowDownIcon size="28" fill={colors.text} />}
      </span>
    </span>
    <div {...styles.menu} aria-expanded={expanded}>
      <SeriesNavPanel t={t} url={url} series={series} />
    </div>
  </button>
)
