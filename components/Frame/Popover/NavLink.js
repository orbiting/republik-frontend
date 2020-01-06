import React from 'react'
import { compose } from 'react-apollo'

import { css } from 'glamor'
import { routes, Link, Router } from '../../../lib/routes'

import { shouldIgnoreClick } from '../../Link/utils'

import { colors } from '@project-r/styleguide'

const styles = {
  link: css({
    textDecoration: 'none',
    color: colors.text,
    ':visited': {
      color: colors.text
    },
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

export const NavA = React.forwardRef(({ inline, children, ...props }, ref) => (
  <a
    ref={ref}
    {...styles.link}
    {...(inline ? styles.inline : styles.block)}
    {...props}
  >
    {children}
  </a>
))

const NavLink = ({
  route,
  children,
  params = {},
  active,
  closeHandler,
  style,
  inline
}) => {
  if (active && active.route === route) {
    const r = routes.find(r => r.name === route)
    return (
      <NavA
        inline={inline}
        style={style}
        href={r && r.getAs(params)}
        onClick={e => {
          if (shouldIgnoreClick(e)) {
            return
          }
          e.preventDefault()
          Router.pushRoute(route, params).then(() => {
            window.scroll(0, 0)
            closeHandler()
          })
        }}
      >
        {children}
      </NavA>
    )
  }
  return (
    <Link route={route} params={params} passHref>
      <NavA inline={inline} style={style}>
        {children}
      </NavA>
    </Link>
  )
}

export default NavLink
