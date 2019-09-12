import { css } from 'glamor'
import PropTypes from 'prop-types'
import React from 'react'

import {
  colors, fontStyles
} from '@project-r/styleguide'

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
    // '@media(hover)': {
    //   '[href]:hover > *': {
    //     opacity: 0.6
    //   }
    // },
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
    display: 'inline-block',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    verticalAlign: 'middle',
    color: colors.primary,
    marginTop: -1,
    paddingLeft: 4,
    ...fontStyles.sansSerifMedium16
  }),
  icon: css({
    display: 'inline-block',
    marginBottom: -2,
    verticalAlign: 'middle'
  })
}

const IconLink = ({ href, onClick, count, style, small }) => {
  const size = small ? 22 : 24
  const fontSize = small ? '15px' : undefined
  const lineHeight = small ? '20px' : undefined
  const patchedStyle = {
    marginLeft: small ? 0 : 20,
    ...style
  }

  return (
    <a href={href} onClick={onClick} {...styles.link} style={patchedStyle}>
      <span {...styles.icon}>
        <Icon size={size} fill={colors.primary} />
      </span>
      {count > 0 && (
        <span
          {...styles.text}
          {...styles.text}
          style={{ fontSize, lineHeight }}
        >
          {count}
        </span>
      )}
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

const Icon = ({ size, fill }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    style={{ verticalAlign: 'middle' }}
  >
    <g transform='translate(2 2)' fill='none' fillRule='evenodd'>
      <path d='M7 20a1 1 0 0 1-1-1v-3H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6.1l-3.7 3.71c-.2.19-.45.29-.7.29H7zm1-6v3.08L11.08 14H18V2H2v12h6z' fill={fill} fillRule='nonzero' />
      <path fill='#fff' fillOpacity={1} d='M8 14v3.08L11.08 14H18V2H2v12z' />
    </g>
  </svg>
)
