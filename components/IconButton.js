import React from 'react'
import { css } from 'glamor'

import { colors, mediaQueries, fontFamilies } from '@project-r/styleguide'

const ICON_SIZE = 24

const IconButton = React.forwardRef(
  (
    {
      Icon,
      href,
      target,
      label,
      labelShort,
      title,
      fill = colors.text,
      onClick,
      children
    },
    ref
  ) => {
    const Element = href ? 'a' : 'button'

    return (
      <Element
        {...styles.button}
        onClick={onClick}
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener' : ''}
        ref={ref}
        title={title}
      >
        <Icon {...styles.icon} size={ICON_SIZE} fill={fill} />
        {label && (
          <span {...styles.label} {...styles.long}>
            {label}
          </span>
        )}
        {labelShort && (
          <span {...styles.label} {...styles.short}>
            {labelShort}
          </span>
        )}
        {children}
      </Element>
    )
  }
)

const styles = {
  button: css({
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    textDecoration: 'none',
    marginRight: 20,
    border: 0,
    padding: 0,
    color: 'inherit',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'opacity 0.3s',
    ':last-child': {
      marginRight: 0
    },
    ':only-child': {
      margin: 0
    },
    '@media(hover)': {
      '[href]:hover > *': {
        opacity: 0.6
      }
    },
    [mediaQueries.mUp]: {
      marginRight: 24
    }
  }),
  icon: css({}),
  label: css({
    fontFamily: fontFamilies.sansSerifMedium,
    letterSpacing: 1,
    fontSize: 14,
    marginLeft: 8,
    whiteSpace: 'nowrap'
  }),
  long: css({
    display: 'none',
    [mediaQueries.mUp]: {
      display: 'initial'
    }
  }),
  short: css({
    display: 'initial',
    [mediaQueries.mUp]: {
      display: 'none'
    }
  })
}

export default IconButton
