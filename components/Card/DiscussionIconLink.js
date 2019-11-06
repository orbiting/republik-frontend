import { css } from 'glamor'
import PropTypes from 'prop-types'
import React from 'react'

import { colors, fontStyles } from '@project-r/styleguide'

const DEFAULT_PADDING = 5

const styles = {
  link: css({
    color: 'inherit',
    display: 'inline-block',
    maxWidth: '100%',
    textDecoration: 'none',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    paddingLeft: DEFAULT_PADDING,
    paddingRight: DEFAULT_PADDING,
    '@media(hover)': {
      '[href]:hover > *': {
        opacity: 0.8
      }
    },
    ':first-child': {
      paddingLeft: 0
    },
    ':last-child': {
      paddingRight: 0
    },
    '@media print': {
      display: 'none'
    }
  }),
  text: css({
    position: 'absolute',
    top: 4 + 2,
    left: 5,
    right: 4,
    textAlign: 'center',
    display: 'inline-block',
    overflow: 'hidden',
    color: colors.primary,
    ...fontStyles.sansSerifMedium,
    fontFeatureSettings: '"tnum" 1, "kern" 1',
    fontSize: 14,
    lineHeight: 1
  }),
  icon: css({
    position: 'relative',
    display: 'inline-block',
    verticalAlign: 'middle'
  })
}

const IconLink = ({ href, onClick, count, style, small }) => {
  const length = String(count).length
  const aw = 4 + (length - 1) * 7
  return (
    <a href={href} onClick={onClick} {...styles.link} style={style}>
      <span {...styles.icon}>
        <Icon aw={aw} fill={colors.primary} />
        <span {...styles.text}>{count}</span>
      </span>
    </a>
  )
}

IconLink.propTypes = {
  href: PropTypes.string,
  onClick: PropTypes.func,
  count: PropTypes.number,
  style: PropTypes.object,
  small: PropTypes.bool
}

export default IconLink

const Icon = ({ fill, aw = 8, ah = 6 }) => {
  const x0 = 18 + aw
  const x1 = 19 + aw
  const x2 = 20 + aw

  const y0 = 20 + ah
  const y1 = 19 + ah
  const y2 = 16 + ah
  const y3 = 15 + ah
  const y4 = 14 + ah
  const y5 = 17 + ah
  return (
    <svg
      width={24 + aw}
      height={24 + ah}
      viewBox={`0 0 ${24 + aw} ${24 + ah}`}
      style={{ verticalAlign: 'middle' }}
    >
      <g transform='translate(2 2)' fill='none'>
        <path
          d={`M7,${y0} C6.44771525,${y0} 6,${y1 +
            0.5522847} 6,${y1} L6,${y2} L2,${y2} C0.8954305,${y2} 0,${y3 +
            0.1045695} 0,${y4} L0,2 C0,0.8954305 0.8954305,0 2,0 L${x0},0 C${x1 +
            0.1045695},0 ${x2},0.8954305 ${x2},2 L${x2},${y4} C${x2},${y3 +
            0.1045695} ${x1 +
            0.1045695},${y2} ${x0},${y2} L11.9,${y2} L8.2,${y1 + 0.71} C8,${y1 +
            0.9} 7.75,${y0} 7.5,${y0} L7,${y0} Z`}
          fill={fill}
        />
        <polygon
          fill='#fff'
          points={`8 ${y4} 8 ${y5 +
            0.08} 11.08 ${y4} ${x0} ${y4} ${x0} 2 2 2 2 ${y4}`}
        />
      </g>
    </svg>
  )
}
