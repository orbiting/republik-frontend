import React from 'react'
import { css } from 'glamor'
import {
  fontStyles,
  useColorContext,
  mediaQueries
} from '@project-r/styleguide'

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
      fill,
      fillColorName,
      onClick,
      onMouseDown,
      children,
      style,
      size
    },
    ref
  ) => {
    const Element = href ? 'a' : 'button'
    const customStyles = style || null
    const [colorScheme] = useColorContext()

    const fillValue = fill || fillColorName || 'text'

    return (
      <Element
        {...styles.button}
        {...((onClick || href) && styles.hover)}
        style={{
          cursor: href || onClick || onMouseDown ? 'pointer' : 'auto',
          ...customStyles
        }}
        onClick={onClick}
        onMouseDown={onMouseDown}
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener' : ''}
        ref={ref}
        title={title}
      >
        <Icon
          {...styles.icon}
          size={size || ICON_SIZE}
          {...colorScheme.set('fill', fillValue)}
        />
        {label && (
          <span
            {...styles.label}
            {...styles.long}
            {...colorScheme.set('color', fillValue)}
          >
            {label}
          </span>
        )}
        {labelShort && (
          <span
            {...styles.label}
            {...styles.short}
            {...colorScheme.set('color', fillValue)}
          >
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
    transition: 'opacity 0.3s',
    ':focus': {
      outline: 'none'
    },
    ':last-child': {
      marginRight: 0
    },
    ':only-child': {
      margin: 0
    },
    [mediaQueries.mUp]: {
      marginRight: 24
    }
  }),
  hover: css({
    '@media(hover)': {
      ':hover > *': {
        opacity: 0.6
      }
    }
  }),
  label: css({
    ...fontStyles.sansSerifMedium,
    fontSize: 14,
    marginLeft: 8,
    whiteSpace: 'nowrap'
  }),
  long: css({
    display: 'none',
    [mediaQueries.mUp]: {
      display: 'inline'
    }
  }),
  short: css({
    display: 'inline',
    [mediaQueries.mUp]: {
      display: 'none'
    }
  })
}

export default IconButton
