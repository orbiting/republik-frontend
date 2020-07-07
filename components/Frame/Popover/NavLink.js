import React from 'react'
import { css } from 'glamor'

import { routes, Link, Router } from '../../../lib/routes'
import { shouldIgnoreClick } from '../../../lib/utils/link'

import { colors, fontStyles } from '@project-r/styleguide'

const styles = {
  link: css({
    textDecoration: 'none',
    color: colors.text,
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
  })
}

export const NavA = React.forwardRef(
  ({ inline, hoverColor, children, dark, style, ...props }, ref) => (
    <a
      ref={ref}
      {...styles.link}
      {...css({ color: dark ? colors.negative.text : colors.text })}
      {...(hoverColor &&
        css({
          transition: 'color 200ms ease-in-out',
          transitionDelay: '33ms',
          '@media (hover)': {
            ':hover': {
              color: hoverColor
            }
          }
        }))}
      {...(inline ? styles.inline : styles.block)}
      style={style}
      {...props}
    >
      {children}
    </a>
  )
)

const NavLink = ({
  route,
  children,
  params = {},
  active,
  closeHandler,
  inline,
  hoverColor,
  prefetch = false,
  minifeed,
  dark
}) => {
  const activeStyle = minifeed && {
    ...fontStyles.sansSerifMedium14,
    lineHeight: '16px',
    marginTop: -1,
    color: dark ? colors.negative.text : minifeed ? hoverColor : colors.text
  }
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
        style={isActive ? activeStyle : undefined}
        inline={inline}
        onClick={!minifeed ? closeHandler : undefined}
        dark={dark}
        hoverColor={hoverColor}
      >
        {children}
      </NavA>
    </Link>
  )
}

export default NavLink
