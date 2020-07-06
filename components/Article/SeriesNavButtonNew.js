import React, { Fragment } from 'react'
import { css } from 'glamor'
import SeriesNavPanel from './SeriesNavPanel'

import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'

import {
  mediaQueries,
  fontFamilies,
  colors,
  useBodyScrollLock,
  useHeaderHeight
} from '@project-r/styleguide'

const plainStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  boxShadow: 'none',
  outline: 'none'
}

const styles = {
  button: css({
    cursor: 'pointer',
    '&, &:focus': plainStyle,
    '@media (hover)': {
      ':hover': plainStyle
    },
    fontFamily: fontFamilies.sansSerifRegular,
    padding: 0,
    textAlign: 'left',
    top: 0,
    whiteSpace: 'nowrap'
  }),
  menu: css({
    backgroundColor: colors.negative.primaryBg,
    color: colors.negative.text,
    fontFamily: fontFamilies.sansSerifRegular,
    position: 'fixed',
    visibility: 'hidden',
    whiteSpace: 'normal',
    opacity: 0,
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    transition: 'opacity 0.2s ease-in-out, visibility 0s linear 0.2s',
    '&[aria-expanded=true]': {
      opacity: 1,
      visibility: 'visible',
      transition: 'opacity 0.2s ease-in-out'
    },
    display: 'flex',
    boxSizing: 'border-box',
    left: 0,
    width: '100vw',
    flexDirection: 'column',
    padding: 0
  }),
  title: css({
    fontSize: 15,
    verticalAlign: 'middle',
    maxWidth: '100%',
    overflow: 'hidden',
    paddingRight: '30px',
    position: 'relative',
    textOverflow: 'ellipsis',
    [mediaQueries.mUp]: {
      fontSize: 18
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

const SeriesNavButton = ({
  items,
  id,
  children,
  t,
  series,
  onSecondaryNavExpandedChange,
  expanded
}) => {
  const [ref] = useBodyScrollLock(expanded)
  const [headerHeight] = useHeaderHeight()
  return (
    <Fragment>
      <button
        {...styles.button}
        onClick={() => {
          onSecondaryNavExpandedChange(!expanded)
        }}
      >
        <span {...styles.title}>
          {series.title}
          <span {...styles.arrow}>
            {expanded && <MdKeyboardArrowUp size='28' fill={colors.text} />}
            {!expanded && <MdKeyboardArrowDown size='28' fill={colors.text} />}
          </span>
        </span>
      </button>
      <div
        style={{
          top: headerHeight,
          height: `calc(100vh - ${headerHeight}px)`
        }}
        {...styles.menu}
        aria-expanded={expanded}
        ref={ref}
      >
        <SeriesNavPanel t={t} series={series} />
      </div>
    </Fragment>
  )
}

export default SeriesNavButton
