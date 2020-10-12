import React from 'react'
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
  }),
  colorTransition: css({
    transition: 'color 200ms ease-in-out',
    transitionDelay: '33ms'
  })
}

export const NavA = React.forwardRef(
  (
    {
      inline,
      hoverCSSColor,
      hoverColor: hoverColorProp,
      children,
      style,
      title,
      large,
      ...props
    },
    ref
  ) => {
    const [colorScheme] = useColorContext()
    const hoverColor = hoverCSSColor || hoverColorProp
    return (
      <a
        ref={ref}
        {...styles.link}
        {...colorScheme.rules.text.color}
        {...(hoverColor && styles.colorTransition)}
        {...(hoverColor &&
          colorScheme.getColorRule('color', hoverColor, ':hover'))}
        {...(inline ? styles.inline : styles.block)}
        {...(large && styles.large)}
        style={style}
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
  hoverColor,
  hoverCSSColor,
  prefetch = false,
  minifeed,
  title,
  large
}) => {
  const isActive =
    active &&
    active.route === route &&
    Object.keys(params).every(key => params[key] === active.params[key])
  const activeStyle =
    isActive && minifeed
      ? {
          ...fontStyles.sansSerifMedium14,
          lineHeight: '16px',
          marginTop: -1,
          color: hoverColor
        }
      : undefined

  return (
    <Link
      route={route}
      params={params}
      prefetch={prefetch ? undefined : prefetch}
      passHref
    >
      <NavA
        title={title}
        style={activeStyle}
        inline={inline}
        onClick={
          !minifeed
            ? e => {
                e.stopPropagation()
                closeHandler()
              }
            : undefined
        }
        hoverColor={hoverColor}
        hoverCSSColor={hoverCSSColor}
        large={large}
      >
        {children}
      </NavA>
    </Link>
  )
}

export default NavLink
