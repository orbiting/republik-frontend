import React, { useMemo } from 'react'
import { css } from 'glamor'

import { Link } from '../../../lib/routes'

import {
  fontStyles,
  mediaQueries,
  useColorContext
} from '@project-r/styleguide'

const styles = {
  link: css({
    textDecoration: 'none',
    '@media (hover)': {
      ':hover': {
        textDecoration: 'underline',
        textDecorationSkip: 'ink'
      }
    }
  }),
  inline: css({
    display: 'inline-block',
    '& + &': {
      marginLeft: 20
    }
  }),
  block: css({
    display: 'block'
  }),
  large: css({
    '& + &': {
      marginTop: 24
    },
    ...fontStyles.sansSerifMedium20,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifMedium22,
      '& + &': {
        marginLeft: 36,
        marginTop: 0
      }
    }
  })
}

export const NavA = React.forwardRef(
  (
    {
      inline,
      formatColor,
      activeFormatColor,
      children,
      style,
      title,
      large,
      isActive,
      ...props
    },
    ref
  ) => {
    const [colorScheme] = useColorContext()
    const hoverRule = useMemo(
      () =>
        formatColor &&
        css({
          transition: 'color 200ms ease-in-out',
          transitionDelay: '33ms',
          '@media (hover)': {
            ':hover': {
              color: colorScheme.getFormatCSSColor(formatColor)
            }
          }
        }),
      [colorScheme, formatColor]
    )

    const colorRule = useMemo(
      () =>
        isActive && activeFormatColor && formatColor
          ? css({
              color: colorScheme.getFormatCSSColor(formatColor)
            })
          : colorScheme.set('color', 'text'),
      [isActive, activeFormatColor, formatColor]
    )

    return (
      <a
        ref={ref}
        {...styles.link}
        {...colorRule}
        {...hoverRule}
        {...(inline ? styles.inline : styles.block)}
        {...(large && styles.large)}
        style={style}
        className={isActive ? 'is-active' : undefined}
        title={title}
        {...props}
      >
        {children}
      </a>
    )
  }
)

const NavLink = ({
  route,
  children,
  params = {},
  active,
  closeHandler,
  inline,
  formatColor,
  prefetch = false,
  minifeed,
  title,
  large
}) => {
  const isActive =
    active &&
    active.route === route &&
    Object.keys(params).every(key => params[key] === active.params[key])

  return (
    <Link
      route={route}
      params={params}
      prefetch={prefetch ? undefined : prefetch}
      passHref
    >
      <NavA
        title={title}
        inline={inline}
        onClick={
          !minifeed
            ? e => {
                e.stopPropagation()
                closeHandler()
              }
            : undefined
        }
        formatColor={formatColor}
        activeFormatColor={minifeed}
        large={large}
        isActive={isActive}
      >
        {children}
      </NavA>
    </Link>
  )
}

export default NavLink
