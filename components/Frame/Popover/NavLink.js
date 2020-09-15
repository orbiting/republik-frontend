import React from 'react'
import { css } from 'glamor'

import { Link } from '../../../lib/routes'

import {
  colors,
  fontStyles,
  mediaQueries,
  useColorContext
} from '@project-r/styleguide'

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
  ({ inline, hoverColor, children, style, title, large, ...props }, ref) => {
    const [colorScheme] = useColorContext()
    return (
      <a
        ref={ref}
        {...css(styles.link, { color: colorScheme.text })}
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
  prefetch = false,
  minifeed,
  title,
  large
}) => {
  const [colorScheme] = useColorContext()
  const activeStyle = minifeed && {
    ...fontStyles.sansSerifMedium14,
    lineHeight: '16px',
    marginTop: -1,
    color: minifeed ? hoverColor : colorScheme.text
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
        title={title}
        style={isActive ? activeStyle : undefined}
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
        large={large}
      >
        {children}
      </NavA>
    </Link>
  )
}

export default NavLink
